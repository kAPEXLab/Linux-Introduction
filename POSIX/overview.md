# POSIX - Portable Operating System Interface

* POSIX is an international standard that defines how applications interact with operating systems.

**History**
* POSIX continues the idea of generalization started by IBM’s System/360, which aimed to make software portable across hardware.
* The formal name of the first POSIX standard is IEEE Standard 1003.1‑1988.
* The name POSIX (pronounced pahz‑icks, like “positive”) was chosen for simplicity.
* In 1990, POSIX became an International Standard (ISO/IEC 9945‑1:1990).
* The IEEE reaffirmed it as IEEE Std 1003.1‑1990, with only clarifications and no major technical changes.


**Why it matters:**
* Applications written to the POSIX standard can run on many different systems with minimal changes.
* This portability reduces maintenance and increases reliability across hardware and OS platforms.
* If an application follows POSIX, it can be moved between POSIX‑compliant systems with high confidence that it will work the same way.

**Key benefits**
* Portability: Write once, run on many systems with little or no change.
* Predictability: POSIX gives exact behavior for functions and utilities, reducing surprises across platforms.
* Interoperability: Libraries and tools that follow POSIX work together more reliably.

**What POSIX defines and what it does not**
**Defines**
* APIs and library interfaces that applications use (file operations, process control, threads, signals, etc.).
* Command shells and standard utilities behavior so scripts and tools behave consistently.
**Does not define**
* An operating system — POSIX is a standard, not software.
* How to implement the OS or applications — it specifies the contract, not the internal design.
* Kernel vs userland internals — POSIX describes the interface and expected behavior, not whether a feature is a system call or a library wrapper.

# The POSIX Family of Standards

|  Standard	|  Focus / Functionality |  
|  :----: |: ------  |  
|  POSIX.1 (IEEE 1003.1)	|  Core system interface: files, processes, signals, I/O, basic library functions|  
|  POSIX.1b (Real‑Time)	|  Real‑time extensions: semaphores, memory locking, timers, IPC, async I/O|  
|  POSIX.1c (Threads)	|  Portable multithreading (pthreads)|  
|  POSIX.2 (IEEE 1003.2)	|  Shell and utilities: command language, 70+ standard tools for scripting|  
|  POSIX.1e (Security)	|  Security extensions: access control lists, audit trails, privilege interfaces|  
|  POSIX.1g (Networking)	|  Protocol‑independent interfaces to network services|  
|  POSIX.3 (Testing)	|  Conformance testing requirements and verification suites|  
