# Operator

It's not easy to build a good operator, it's the first serious golang project and my knowledge on Kubernetes is growing by the day.

It can do cool stuff but I've deliberarly tried to position "reverse-gitops.dev" totally sepearted: others might like this and potenially could take other approaches.

I'm actively developing this so let me know what you think. You won't vibe code it in a day with all the details.

The goals is to move Kubernetes API activitiy into GitOps compatible YAML files. Some properties that I would like to see:

This is all a matter of time -> not easy, but certainly doable.

* HA support
* Files have to follow a convention (where they are placed). Obviously this is true: but what if you hook it up to your existing structure that is different?
* Multi yaml files
* Simple bi-directional support for image tags and kustomize (not really sure on this direction tough).
* Let's do some definitions:
    * exploding of terms


I'm aware that it's not perfect -> but it will do certain things right
* Support SSH and HTTPS connections
* Write secrets only with a SOPS key
* 