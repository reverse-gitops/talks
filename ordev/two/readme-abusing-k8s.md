Session details
Configuration Deserves a Software Delivery Process Too
keyboard_arrow_down

remove
(Ab)using the Kubernetes API as a Configuration Backend
keyboard_arrow_up

remove
Configuration-heavy products often reinvent the same backend machinery: typed objects, validation, permissions, audit trails, and some form of realtime change propagation. Over time, that configuration backend starts to look a lot like a control plane.

 

Kubernetes already is one.

 

Its API gives you typed resources, schema validation, optimistic concurrency, watches, and mature authentication and authorization. Those are powerful building blocks for systems where users and services need to manage desired state rather than send one-off commands.

 

The interesting part is that your consumers do not need to know Kubernetes is there. They can interact with a clean domain-specific API, while Kubernetes acts as the hidden backend that stores intent, enforces policy, and drives change through the system.

 

In this talk I will explore the Kubernetes API as a backend for configuration-heavy software products rather than as an infrastructure surface. I will show what this approach enables, what architectural trade-offs it introduces, and where the model starts to break down. Attendees will leave with practical criteria for evaluating Kubernetes as a configuration backend, a better understanding of which control-plane capabilities are genuinely reusable, and a sharper sense of the trade-offs involved in hiding Kubernetes behind a product-facing API.

Architecture

DevOps
Fri 11:15 am - 11:55 am ➝ 40 min
schedule
TURING
door_front