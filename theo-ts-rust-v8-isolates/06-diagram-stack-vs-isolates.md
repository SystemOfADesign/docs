# 06 - Whiteboard: normal hosting stack vs Chrome, V8 and isolates

One line: Theo draws three stacks of the same six layers, one plain, one with Docker and three guest systems on top, one with Chrome, V8 and four isolates on top, to argue that isolating at the V8 layer skips the cost of running an operating system per tenant.

- Window: [35:15] to [38:55], plus two short returns at [39:40] and [41:25].
- Tool: an Excalidraw board named "ts-rust" (SHOWN). All boxes are dashed, hand-drawn style.
- Timestamps come from 5 s frames, so each state is accurate to about +/- 5 s.
- Labels: SAID = Theo says it, SHOWN = on screen, INFERRED = my reading.
- "Loose wording" marks a statement that is technically imprecise. It is flagged here and checked in `05-claims-fact-check.md`. No fact-checking is done in this file.

## Why he draws it

- SAID [34:45-35:15]: viewers were comparing the demo to services that "let you execute code". He stops to explain why "nothing here left V8" is the point.
- The drawing answers one question: at which layer do you separate one customer (or one agent) from another, and what does each choice cost?

## State 1 - The plain computer stack [35:15-35:45]

SHOWN, in the order drawn:

| Time | Added |
|---|---|
| [35:20] | Hardware |
| [35:25] | Drivers |
| [35:30] | Kernel |
| [35:35] | Operating system, then a top box (typed "App") |
| [35:40] | File system inserted between Operating system and Applications |

```
+----------------------+
|     Applications     |
+----------------------+
|     File system      |   <- added last, "kind of"
+----------------------+
|   Operating system   |
+----------------------+
|        Kernel        |
+----------------------+
|       Drivers        |
+----------------------+
|       Hardware       |
+----------------------+
```

SAID [35:15-35:45]:

- Hardware is CPU, RAM and so on.
- Drivers sit above it and are how the kernel talks to hardware.
- Then the operating system, then "file system, kind of", then applications.

Loose wording, see 05-claims-fact-check.md:

- Drivers "are provided by the thing above, the kernel".
- Kernel and operating system as two separate layers.
- File system as its own layer between the OS and applications.

## State 2 - "Not deploying it here" [35:50-36:00]

SHOWN: the stack is duplicated. An arrow from the right points at the Operating system box of the copy.

```
+----------------------+
|     Applications     |
+----------------------+
|     File system      |
+----------------------+
|   Operating system   | <------
+----------------------+
|        Kernel        |
+----------------------+
|       Drivers        |
+----------------------+
|       Hardware       |
+----------------------+
```

SAID [35:47-36:00]:

- Question posed: how does Heroku, Hetzner "or any normal cloud" work?
- A Docker image on AWS is not deployed at the layer the arrow marks, because the lower layers belong to AWS's hardware and must carry many systems.

## State 3 - Docker with three guest systems [36:05-36:20]

SHOWN:

- [36:05] Applications is renamed "Docker".
- [36:10] Three narrow copies of File system / Operating system / Kernel / Drivers are stacked on top of Docker.
- [36:20] The arrow moves from Operating system to Docker.

```
+-----------+-----------+-----------+
|File system|File system|File system|
+-----------+-----------+-----------+
| Operating | Operating | Operating |
|  system   |  system   |  system   |
+-----------+-----------+-----------+
|  Kernel   |  Kernel   |  Kernel   |
+-----------+-----------+-----------+
|  Drivers  |  Drivers  |  Drivers  |
+-----------+-----------+-----------+
|              Docker               | <------ (from [36:20])
+-----------------------------------+
|            File system            |
+-----------------------------------+
|         Operating system          |
+-----------------------------------+
|              Kernel               |
+-----------------------------------+
|              Drivers              |
+-----------------------------------+
|             Hardware              |
+-----------------------------------+
```

SAID [36:00-36:18]:

- The provider puts "something like Docker" in the application layer.
- Then "you copy-paste everything": each tenant gets its own stack on top.
- "This is how hosting on normal VPS providers works."

Loose wording, see 05-claims-fact-check.md:

- Docker as the thing that carries a full guest kernel and drivers per tenant.
- "Normal VPS providers" equated with Docker.

Frame: [t36m15s-docker-three-guest-stacks.jpg](assets/t36m15s-docker-three-guest-stacks.jpg) - [36:15] three guest stacks, each with its own kernel and drivers, on top of Docker.

## State 4 - He corrects himself: "Docker shim to kernel" [36:25-37:05]

SHOWN:

- [36:25] The three guest Kernel and Drivers rows are selected.
- [36:30] They are replaced by one wide empty box.
- [36:35] The box is labelled "Docker shim to kernel".
- [36:40-36:45] A curved arrow runs from the left side of that box down to the host Kernel.

```
     +-----------+-----------+-----------+
     |File system|File system|File system|
     +-----------+-----------+-----------+
     | Operating | Operating | Operating |
     |  system   |  system   |  system   |
     +-----------+-----------+-----------+
  .--|       Docker shim to kernel       |
  |  +-----------------------------------+
  |  |              Docker               |
  |  +-----------------------------------+
  |  |            File system            |
  |  +-----------------------------------+
  |  |         Operating system          |
  |  +-----------------------------------+
  '->|              Kernel               |
     +-----------------------------------+
     |              Drivers              |
     +-----------------------------------+
     |             Hardware              |
     +-----------------------------------+
```

SAID [36:18-37:15]:

- It is "not technically running a new kernel instance always"; usually it is a "shim kernel".
- He names the layer a "Docker hypervisor" and adds "I don't fully understand it".
- The shim lets guests "skip steps" by reaching the host kernel.
- Each guest still builds "an OS on top".
- Example: one AWS box with one tenant on Ubuntu, one on Windows Server, one on Debian.
- Conclusion: every guest "takes RAM", which is why each new container on your own machine uses "a bunch of resources".

Loose wording, see 05-claims-fact-check.md:

- "shim kernel" and "Docker hypervisor".
- Ubuntu, Windows Server and Debian tenants on one box described as "the application layer of Docker".
- "It takes resources to run operating systems in your operating system" as the description of a container.
- He states his own uncertainty on this layer.

Frame: [t36m45s-docker-shim-to-kernel.jpg](assets/t36m45s-docker-shim-to-kernel.jpg) - [36:45] guest kernels replaced by one "Docker shim to kernel" box with an arrow to the host kernel.

## State 5 - Chrome, V8 and isolates [37:10-37:35]

SHOWN:

- [37:10] He pans left. The plain stack from State 1 sits under his earlier notes ("Real AI costs: the compute your agent runs on ...").
- [37:15] A new copy of the plain stack is made.
- [37:20] Applications is renamed "Chrome".
- [37:25] "V8" is added above Chrome.
- [37:30] Four boxes above V8, all first labelled "Isolate 1".
- [37:35] Renumbered Isolate 1 to Isolate 4.

```
+---------+---------+---------+---------+
| Isolate | Isolate | Isolate | Isolate |
|    1    |    2    |    3    |    4    |
+---------+---------+---------+---------+
|                  V8                   |
+---------------------------------------+
|                Chrome                 |
+---------------------------------------+
|              File system              |
+---------------------------------------+
|           Operating system            |
+---------------------------------------+
|                Kernel                 |
+---------------------------------------+
|                Drivers                |
+---------------------------------------+
|               Hardware                |
+---------------------------------------+
```

SAID [37:15-37:50]:

- Same stack, but the application is Chrome.
- Inside Chrome is V8, "the JavaScript runtime".
- Inside V8 are isolates, which run different JS files and functions "at the same time".
- If an app fits in an isolate it does not need to "shim out to the kernel", run an OS and "steal a bunch of resources".
- Rhetorical test: which costs more, a new Docker instance of Postgres or a new Chrome tab?

Loose wording, see 05-claims-fact-check.md:

- V8 as "the JavaScript runtime" (earlier, at [29:06], "engine").
- Isolates living "in V8" as if one V8 hosts them all, and running "at the same time".
- Chrome tab equated with one isolate.
- Postgres container vs Chrome tab as a like-for-like comparison.

Frame: [t37m35s-chrome-v8-isolates.jpg](assets/t37m35s-chrome-v8-isolates.jpg) - [37:35] the isolate stack: four isolates on V8 on Chrome on one shared OS.

## State 6 - A transient arrow, then removed [37:40-38:00]

SHOWN:

- [37:40] An arrow is drawn from Isolate 1 curving down the left side to about the Kernel row.
- [37:45] The arrow is gone. The stack stays clean until [38:00].

SAID at that moment [37:35-37:45]: an isolate "doesn't need to shim out to the kernel".

INFERRED: the arrow was the Docker-style path to the kernel, drawn to show what isolates do not do, then undone.

## State 7 - Arrow at V8: where the money went [38:05-38:30]

SHOWN: a hooked arrow from the upper left points at the V8 box.

```
       +---------+---------+---------+---------+
       | Isolate | Isolate | Isolate | Isolate |
  |    |    1    |    2    |    3    |    4    |
  |    +---------+---------+---------+---------+
  '--->|                  V8                   |
       +---------------------------------------+
       |                Chrome                 |
       +---------------------------------------+
       |      (File system ... Hardware)       |
       +---------------------------------------+
```

SAID [37:52-38:25]:

- Chrome tabs use far fewer resources than containers because of the "billions of dollars" Google put into V8.
- Motive given: make the web good enough that Google could stop shipping Windows apps.
- That investment benefits the whole ecosystem, "including all of Cloudflare".

Loose wording, see 05-claims-fact-check.md:

- The dollar figures ("billions", then "a billion").
- The stated motive for Google's investment.

## State 8 - Back to the Docker stack: Cloudflare's bet [38:35]

SHOWN: he pans back to the State 4 drawing (Docker, shim, arrow to host kernel).

SAID [38:23-38:40]:

- Cloudflare's platform rests on the idea that virtualizing at the OS level, "by putting an OS at the app layer", is "stupid".
- V8 is "a much better abstraction" for hosting customer applications.

Loose wording, see 05-claims-fact-check.md: Cloudflare's design summarized as a judgement on OS-level virtualization.

## State 9 - Arrow moved to an isolate: the catch [38:40-38:55]

SHOWN:

- [38:40] Back on the isolate stack; the arrow still points at V8.
- [38:45] The arrow is dragged up.
- [38:50] It now points at Isolate 1.

```
  |
  |    +---------+---------+---------+---------+
  '--->| Isolate | Isolate | Isolate | Isolate |
       |    1    |    2    |    3    |    4    |
       +---------+---------+---------+---------+
       |                  V8                   |
       +---------------------------------------+
       |                Chrome                 |
       +---------------------------------------+
       |      (File system ... Hardware)       |
       +---------------------------------------+
```

SAID [38:40-39:20]:

- "The catch is that these are just JavaScript."
- No kernel calls, because there is no kernel the isolate can reach.
- No file writes, because there is no file system.
- "Anything that a Chrome tab can't do, a V8 isolate can't do."
- So isolates are "a good place to put the code once it's built" and "not a good place to build".

Loose wording, see 05-claims-fact-check.md:

- "Anything that a Chrome tab can't do, a V8 isolate can't do."
- "There's no file system" stated as absolute.

## Later returns to the diagram

| Time | SHOWN | SAID |
|---|---|---|
| [39:40-39:45] | The isolate row and the arrow are selected together. | Cloudflare's focus is "this isolate layer". just-bash "lies to agents living in this isolate layer" so they believe they have a file system. "That is what we have built here." |
| [41:25-41:35] | Final clean view of the isolate stack with the arrow at Isolate 1. | ts-rust is "one of the final pieces" for an end-to-end TypeScript dev experience in an isolate instead of a VM. |

## The three stacks side by side

Redraw of the end state of each stack. INFERRED layout; on the board they sit at different positions and are never all on screen at once.

```
 PLAIN MACHINE         DOCKER HOSTING                 CHROME / V8
 [35:40]               [36:45]                        [37:35]

                       +------+------+------+
                       |  FS  |  FS  |  FS  |         +----+----+----+----+
                       +------+------+------+         | I1 | I2 | I3 | I4 |
                       |  OS  |  OS  |  OS  |         +----+----+----+----+
                       +------+------+------+         |        V8         |
 +--------------+      | Docker shim to     |         +-------------------+
 | Applications |      | kernel             |         |      Chrome       |
 +--------------+      +--------------------+         +-------------------+
 | File system  |      |       Docker       |         |    File system    |
 +--------------+      +--------------------+         +-------------------+
 | Operating    |      |    File system     |         | Operating system  |
 | system       |      +--------------------+         +-------------------+
 +--------------+      |  Operating system  |         |      Kernel       |
 | Kernel       |      +--------------------+         +-------------------+
 +--------------+      |       Kernel       |         |      Drivers      |
 | Drivers      |      +--------------------+         +-------------------+
 +--------------+      |      Drivers       |         |     Hardware      |
 | Hardware     |      +--------------------+         +-------------------+
 +--------------+      |      Hardware      |
                       +--------------------+
```

| Question | Docker stack, as drawn | Isolate stack, as drawn |
|---|---|---|
| What is repeated per tenant | A file system and an operating system each | One isolate each |
| What is shared | Host kernel, reached through a shim; everything below | V8, Chrome, the OS and everything below |
| Per-tenant cost, per Theo | RAM for an OS per tenant (SAID [36:55]) | Close to a browser tab (SAID [37:50]) |
| What the tenant can do | Anything a Linux box can (SAID [27:10], about agents) | JavaScript only: no kernel calls, no file system, no native code (SAID [38:45], [30:20]) |

## How the diagram connects to the demo

- SAID [39:24-40:10]: the demo puts fakes inside the isolate box for the things the box lacks.
  - File system and bash: faked in JS (just-bash).
  - Type checker: ts-rust compiled to WASM.
  - So "the whole dev loop exists in V8" (SAID [34:55]).
- SAID [39:50]: if the server's real file system were read-only, the demo "will still run exactly the same".
- SAID [32:50]: the demo itself "is running in Node on a server technically".
- INFERRED: in the diagram's terms, the demo's "Chrome" box is Node, and the claim about Cloudflare is that the same isolate box can be moved onto Workers. The video does not show that move completed (see `01-video-overview.md`, Mismatches).

## What the diagram leaves out

INFERRED from the drawing itself, not a fact-check:

- No hypervisor or microVM layer appears, though at [25:05] he describes Cursor's cloud agents as full VMs and at [30:05] says other hosts split tenants "with VMs and Docker".
- No process boundary appears between Chrome and V8 or between isolates.
- WASM does not appear, though the demo depends on it running inside the isolate.
- The event-loop and CPU-sharing argument he makes at [40:20-41:00] is spoken only; nothing is drawn for it.

## Could not determine

- Exact start point of the State 4 arrow. At [36:45] it leaves the left edge of the "Docker shim to kernel" box; at [38:35] it looks attached nearer the guest Operating system row. 5 s frames do not settle it.
- Whether the State 6 arrow was undone or deleted. It is present at [37:40] and absent at [37:45].
