Q&A

---

Is git the source of truth?

---

How do you do authentication?

---

Can you ...?

I will certainly take it into consideration.

---

# How do you know?

Kubernetes API has native support OIDC, so you can hook up your auth system and know for sure who you are dealing with. If they have bad intent you can seek them out.

---

# Does the RBAC system really apply?

Creating new resources is a bit hard: you can only limit that in the scope of a namespace. But no-one is refraining you from hooking up known tools to check if something is allowed.

---

# Is this a real audit log?

* That depends on your git configuration: conceptually I don't see any problems with building support for signed commits. 
* As long as your git provider is configured to not allow force pushes on main then there is no way to erase history.

---
