# Faster CI for Azure DevOps, GKE, Next.js 16, and FastAPI

Keep Azure DevOps as the PR gate and GKE as the deployment target. Measure agent wait, setup, and execution first. Tune the bottleneck that actually delays merges, then narrow which work runs per PR once the selection logic is proven.

## 1. Source analysis

### Boardy’s reported results

Owen Gretzinger reports that Boardy reduced PR CI wait from **up to 40 minutes to about 2 minutes**. The runner move alone took the reported wait from roughly 40 minutes to 10. The monthly bill increased from **$230 to $4,300**, a **$4,070/month** increase. Treat the figures as case-study observations. A common latency percentile, traffic-normalized cost, and controlled attribution for individual changes remain unknown. [Boardy’s original article](https://x.com/owengretzinger/status/2116291924219060319)

| Change | Boardy’s reported result | What to test on another stack |
| --- | --- | --- |
| Replace default GitHub-hosted runners | Agent wait up to 11m → 8s | Measure all required jobs, including jobs that only execute for seconds. |
| Replace ESLint with Oxlint | 120s → 5s | Measure equivalent rule coverage and run time. |
| Benchmark faster TypeScript checkers | Cold server check 70s on `tsc` → 13s on TS 7 → under 5s on `bun check` | Compare diagnostics, time, and peak memory on the actual CI agents. |
| Shard an eight-minute test target | Six shards on 8-vCPU agents, each with its own DB | Compare agent size and worker count before duplicating setup across more shards. |
| Share Vitest module state | Per-shard time 100s → 35s | Profile module imports. Opt in only tests with reliable cleanup. |
| Repair cache seeding and setup | Dependency cache misses about 50% → 1%. Server test job 168s → 74s. | Measure restore, install, and save together. Verify target-branch caches are visible to PRs. |
| Use a blobless Git fetch | Checkout 36s → 12s | Retain the history required for affected checks. |
| Right-size in-job concurrency | Four tasks on 4 vCPUs matched the previous eight-task latency and removed a flaky test | Measure CPU, memory, and database contention alongside wall time. |
| Rebalance the fan-out | Moving migrations and unrelated tests off the slowest shard saved about 2m | Inspect the longest dependency chain and the slowest required job. |
| Select affected projects | Nx selects touched projects. Full suite runs nightly. | Prove that affected work cannot silently report green after being skipped. |
| Run quick checks before push | Format, lint, and type feedback in under 9s | Use a local hook for feedback and keep the PR check authoritative. |

Several figures cover overlapping parts of the same jobs. Adding them would double-count savings. Boardy also audited roughly 20,000 server tests and found few worth cutting. Its measured opportunity was mostly in startup, scheduling, and repeated work. [Boardy’s original article](https://x.com/owengretzinger/status/2116291924219060319)

### What the references add

- **Linear.** While its test suite nearly quadrupled, PR wait fell from over six minutes to just over five and runner time per test roughly halved. Its change-detection gate fell from 26s to 8s median. It narrowed pnpm installs, prebaked dependencies, and batched seven short checks into two jobs. A `node_modules` restore took about 28s versus about 7.5s for a filtered install in one comparison. Boardy measured a 13s restore against a 33s install. Measure the same tradeoff locally. Linear also opted individual files into shared Vitest state and retained isolation for fragile cases. [Linear’s engineering write-up](https://linear.app/now/ci-bottleneck-reworked)
- **Vercel CI, Blacksmith, and Boat.** Vercel’s beta announcement describes a Turborepo task graph, cached outputs, and independently provisioned compute. Its 2–6× claim comes from internal repos, and the PR check integration described is GitHub. Blacksmith documents GitHub Actions runners. Boat offers general-purpose agent VMs. For Azure DevOps, reuse the principles of cheap task selection and fast agent starts. [Vercel CI announcement](https://vercel.com/blog/introducing-vercel-ci) · [Blacksmith docs](https://docs.blacksmith.sh/) · [Boat](https://boat.dev/)
- **Bun.** Jarred Sumner’s 1.7–7× result compares Bun canary to Bun 1.4.3 across four cold projects on a 64-core system. Bun documents that its checker follows TypeScript 7 behavior regardless of the repo’s installed TypeScript version. Benchmark a pinned version on representative commits and hardware. [Benchmark post](https://x.com/jarredsumner/status/2112042460847464463) · [Bun type-checking docs](https://bun.sh/docs/runtime/check)
- **Bottlenecks and selection.** Arpit Bhayani applies Amdahl’s law to the full delivery cycle and points out that more change volume can deepen downstream queues. Kun Chen separates merge protection from release protection and suggests tracking affected work through module boundaries. Andreas Kling’s profiling anecdote illustrates how several small setup costs can add up. [Bhayani](https://x.com/arpit_bhayani/status/2113611314543407606) · [Chen](https://x.com/kunchenguid/status/2115565245293039814) · [Kling](https://x.com/awesomekling/status/2090099318090793445)
- **Agent feedback, cost, and test quality.** Matt Pocock argues for strong mechanical feedback. Rory Graman suggests putting quick checks in a hook. Flo Crivello describes rising CI costs. Peter Steinberger links OpenClaw’s test-audit guide, which asks whether tests independently protect an observable behavior or merely duplicate implementation details. Use the test audit when measurements point to the suite itself. [Pocock](https://x.com/mattpocockuk/status/2115368342898848021) · [Graman](https://x.com/rorygraman/status/2113714494400802876) · [Crivello](https://x.com/Altimor/status/2104094039805174164) · [OpenClaw test-audit guide](https://github.com/openclaw/openclaw/blob/main/.agents/skills/test-audit/SKILL.md)

## 2. Stack-specific design

Assumptions for the examples are Azure DevOps Services, Azure Repos Git, Linux agents, and separate web and API images. Repo layout, test tools, database, and GKE endpoint access still need local verification. Apply the pnpm workspace, Vitest, uv, and Postgres examples where those tools fit the repo.

| Layer | First choice | Condition for expanding it |
| --- | --- | --- |
| Azure Pipelines agents | Measure the existing pool. Pilot stateless Managed DevOps Pools with standby capacity if agent provisioning drives the wait. | Buy parallel-job capacity if the org consistently reaches its entitlement. Use an isolated deployment pool that can reach GKE. |
| Next.js | Pinned Node and pnpm, explicit ESLint, and a representative production build. | Shadow Oxlint, TS 7, or Bun only when lint or type checking materially delays merges. |
| FastAPI | Existing locked Python dependencies and type checker, Ruff where rules match, and pytest. | Tune fixture reuse, then test two or four xdist workers. Add agents only if that reduces the slowest required result. |
| PR selection | Web and API run together. Include a cross-service contract check. | Measure candidate skips before enabling service-level filtering. Reuse Nx if it models the workspace already. |
| GKE release | Protected Azure DevOps release pipeline, Artifact Registry, and image digests. | Add a protected GKE preview or release smoke test when ingress, identity, or cluster-only behavior needs coverage. |

### Azure DevOps measurement and agent capacity

1. Pull **100–150 recent PR validation runs**. Use the Builds API for queue, start, and finish times. Use Timeline records for job and step timings. Where your logs expose agent acquisition timestamps, measure job wait directly. The pipeline-level queue interval captures only the initial wait.
2. Record **p50 and p95 PR update to required result**, time to first failure, checkout, cache restore/save, installation, build, and tests. Track agent-minutes, cache hits, cancellations, retries, and flakes. Report costs per terminal PR validation outcome with rerun and canceled compute included. Compare runs with similar PR scope and daytime concurrency.
3. Read the **pool consumption report**. Jobs queued while the org is at the parallel-job limit indicate an entitlement bottleneck. Queued jobs below that limit warrant checking agent availability, demands, and provisioning. Use a pilot with the same commits, comparable cache state, and comparable concurrency to measure a pool change.
4. If agents are the bottleneck, start with a small stateless Managed DevOps Pool and standby coverage aligned with working hours. Benchmark two VM sizes. Keep deployment agents isolated from the PR pool, with private GKE connectivity if the endpoint requires it.

[Builds API](https://learn.microsoft.com/en-us/rest/api/azure/devops/build/builds/list?view=azure-devops-rest-7.1) · [Timeline API](https://learn.microsoft.com/en-us/rest/api/azure/devops/build/timeline/get?view=azure-devops-rest-7.1) · [Parallel jobs and pool consumption](https://learn.microsoft.com/en-us/azure/devops/pipelines/licensing/concurrent-jobs) · [Managed DevOps Pools scaling](https://learn.microsoft.com/en-us/azure/devops/managed-devops-pools/configure-scaling)

### Checkout, dependency caches, and job layout

- **Warm dependency caches on the target branch within the same pipeline.** Azure Pipelines PR jobs can read the target-branch cache in that pipeline. Successful main runs should execute the same cache steps and populate compatible keys. Separate the pnpm store, Python download/wheel cache, and Next.js build cache. Scope by relevant OS, architecture, toolchain, and lockfile. Always run the locked install. Treat cache hits as a performance signal.
- **Measure both cache time and install time.** Start with the pnpm store and Python dependency cache. Trial `.next/cache` separately against the exact Next.js patch and build mode. Azure caches are immutable. For mutable build caches, use a source fingerprint or revision in the save key and a compatible prefix for restoring older entries. If Next runs inside a Docker build, connect the build to an explicit persisted cache strategy. A host-side cache task alone leaves the container build isolated.
- **Use a small number of jobs first.** Start web and API in parallel. Share checkout and install across short checks in each lane. Split build or integration tests into separate jobs when the additional agent start and setup produce a shorter required path. On a history-dependent workflow, test `fetchDepth: 0` with `fetchFilter: blob:none`. Disable tag fetching only if version and release tooling can tolerate it.

[Azure cache scopes and immutability](https://learn.microsoft.com/en-us/azure/devops/pipelines/release/caching#cache-isolation-and-security) · [Azure checkout options](https://learn.microsoft.com/en-us/azure/devops/pipelines/yaml-schema/steps-checkout) · [Next.js build caching](https://nextjs.org/docs/app/guides/ci-build-caching#azure-pipelines) · [BuildKit registry cache](https://docs.docker.com/build/cache/backends/registry/)

### PR validation and affected checks

Configure required **Build validation** on the Azure Repos target branch. It builds the PR merge commit. Explicitly choose the build expiration policy for target-branch updates. Start with the web and API lanes both required. Give contract changes their own check or require it in one of those lanes. Keep approval and deployment checks on protected release resources. [Azure Repos PR validation](https://learn.microsoft.com/en-us/azure/devops/pipelines/repos/azure-repos-git#pr-triggers) · [Branch policy settings](https://learn.microsoft.com/en-us/azure/devops/repos/git/branch-policies#set-build-validation)

| Files changed | Proposed validation |
| --- | --- |
| Web app only | Web lint, tests, type coverage, and production build |
| API implementation only | API lint, type checks, and tests. Include the contract check where public behavior can change. |
| OpenAPI schema, generated client, shared code, or shared runtime config | Web, API, and cross-service contract checks |
| Migration files | API integration and real migration replay. Include cross-service checks for relevant compatibility changes. |
| Lockfiles, CI templates, or ambiguous paths | Both lanes and any affected container or contract checks |
| Docs only, verified by an explicit allowlist | Docs check or a recorded skip |
| Unresolved Git base or classifier failure | Run all required checks or fail visibly |

For PRs, diff the validated merge commit against its verified target-side parent. Resolve the appropriate refs for other event types. Account for renames and deletions. First log the selection while both lanes still run. Add fixtures for every row in the table, then make selected jobs conditional. The final validation must check selected job outcomes explicitly and fail if a selected job was unexpectedly skipped. Run the full suite nightly on main to catch regressions outside the selected set. [Azure Pipelines conditions](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/conditions) · [Boardy’s skipped-shard failure](https://x.com/owengretzinger/status/2116291924219060319)

### Next.js 16

Next.js 16 defaults to Turbopack, removes `next lint`, and no longer lints inside `next build`. Run the repo’s lint script explicitly and keep the production build representative of the Docker image. If an early type-check lane is worthwhile, run `next typegen` before `tsc` so generated routes and `next-env.d.ts` are available. Type generation loads production-phase Next configuration. Give it the CI-safe inputs it needs. Keep the built-in build type check until a required standalone check demonstrates equivalent coverage. [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16) · [Next CLI type generation](https://nextjs.org/docs/app/api-reference/cli/next#next-typegen-options) · [Next.js build type checking](https://nextjs.org/docs/app/api-reference/config/next-config-js/typescript)

```sh
# Run at the workspace root.
pnpm install --frozen-lockfile

# Run from the Next.js app directory.
pnpm run lint
pnpm exec next build

# Optional early type-check job, after the same locked install.
pnpm exec next typegen
pnpm exec tsc --noEmit
```

- **Oxlint trial.** Compare the actual Next.js, React Hooks, accessibility, import, type-aware, and custom ESLint rules. Keep any required rules that lack verified equivalents in an ESLint pass. Compare warm and cold timings.
- **Type-checker trial.** Shadow pinned TS 7 or Bun on the same generated types and tsconfig. Include a corpus of real passing and failing changes, especially generated route types, project references, and shared packages. Compare diagnostics and peak memory. Keep pnpm and Node during the trial.
- **Vitest, if present.** Profile import and environment setup first. Use a small opt-in project for shared module state. Keep files with unresolved fake timers, globals, or module mocks isolated. Exercise eligible files in varying order before expanding coverage. Keep browser tests distinct so they can be measured separately.

[Oxlint migration guide](https://oxc.rs/docs/guide/usage/linter/migrate-from-eslint.html) · [TypeScript 7](https://github.com/microsoft/typescript-go#typescript-7) · [Bun checker compatibility](https://bun.sh/docs/runtime/check) · [Vitest performance guide](https://vitest.dev/guide/improving-performance)

### FastAPI

- **Measure before sharding.** Time pytest collection, fixture setup, import, and test requests. Use HTTPX `ASGITransport` to exercise HTTP behavior in-process where appropriate. Manage lifespan explicitly for tests that rely on startup and shutdown.
- **Share expensive infrastructure at the worker level.** Reuse resources that can be reset safely. Restore mutable state between tests. For Postgres, assign each worker its own database or schema and verify its teardown. If schema replay dominates, use a versioned snapshot for ordinary integration tests and run real replay for migration changes and nightly validation.
- **Benchmark the process count.** Try serial, two workers, and four workers on equivalent agents. Use `--dist loadscope` to keep expensive module or class fixtures together, or try `--dist worksteal` for uneven durations. Compare latency, memory, open database connections, and flakes before adding an agent shard.
- **Keep the dependency model stable.** Start with the existing lockfile and checker. Use Ruff for lint and format when rule coverage matches. If the project already uses uv, use locked sync and test whether its cache saves time. Treat a Python package-manager migration as its own change.

[FastAPI async tests and lifespan](https://fastapi.tiangolo.com/advanced/async-tests/) · [pytest-xdist distribution modes](https://pytest-xdist.readthedocs.io/en/stable/distribution.html) · [Ruff](https://docs.astral.sh/ruff/) · [uv locking and syncing](https://docs.astral.sh/uv/concepts/projects/sync/)

### GKE delivery

1. **PR validation.** Run service checks and any required container builds in the PR pipeline. Keep its job identity separate from production deploy and image publishing.
2. **Build and publish.** After merge, build versioned web and API images on the protected pipeline. Publish to Artifact Registry and record digests. If using a registry-backed BuildKit cache, give trusted writers a separate cache reference from release images and decide which cache sources PR jobs may consume.
3. **Authenticate and deploy.** Use Google Cloud’s Azure DevOps Workload Identity Federation flow for short-lived credentials. Scope push access to the image repository and deployment access to the cluster resources the job needs. Verify GKE endpoint reachability and install the GKE auth plugin on the deployment agent. Configure Azure DevOps environment approvals and branch checks outside the pipeline YAML. Promote the same image digests through environments.
4. **Verify the rollout.** Check Kubernetes readiness and run a smoke test through the real ingress that exercises web → API. Keep API and database changes compatible with the previous version during a rolling update. Preserve prior digests for rollback and verify the migration strategy supports rollback or forward recovery.
5. **Account for Next.js replicas.** If using standalone output, package the server, `.next/static`, and `public` assets or serve the assets separately. `NEXT_PUBLIC_*` values are fixed at build time. Build-once promotion requires compatible values or a runtime configuration design. Where applicable, test asset and Server Action version skew and shared ISR cache behavior across replicas and revisions.

[Azure DevOps federation for Google Cloud](https://cloud.google.com/iam/docs/workload-identity-federation-with-deployment-pipelines) · [Artifact Registry with GKE](https://cloud.google.com/artifact-registry/docs/integrate-gke) · [GKE cluster access](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl) · [Azure environment checks](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/approvals) · [Next.js standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output) · [Next.js self-hosting](https://nextjs.org/docs/app/guides/self-hosting#multi-server-deployments)

## 3. Rollout sequence

| Sequence | Change | Evidence to keep it |
| --- | --- | --- |
| 1 | Baseline current PR CI and cost | Breakdown for the jobs that drive p50 and p95, with cache and retry rates |
| 2 | Fix the largest wait category | Comparable runs showing lower queue or setup time and acceptable cost |
| 3 | Overlap web and API, batch short work, tune slow tests | Faster required result without increased flakes or lost validation |
| 4 | Trial compiler, linter, or test-runner changes where they still matter | Diagnostic or behavior parity and improved end-to-end time |
| 5 | Shadow affected selection, then enforce it | Evidence that changed contracts and shared files trigger the required jobs and selected skips fail visibly |

Use **p95 PR update to required result** and **cost per validated PR** together. Track time to first failure for the agent feedback loop. The first implementation slice is the timing baseline plus whichever one change it identifies, typically cache seeding, agent availability, or repeated setup.
