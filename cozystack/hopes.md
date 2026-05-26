My story
* Personal frustration: writing queries and processes to move customer settings through stages. An SQL Database is not wrong, but it's just not easy for tht goal. 
* API keys and passwords are not always encryped:
* When AI was starting to fly (for me at least) last summer I decided to quit my full time job. Pursue building a product to help people to build their configuration as artifacts.
* I did tried to push this with a team: as a side product, that failed. The learnings are in the new approach.

My own potenial goals:
* Getting my own story straight, learning how to speak
* Getting some traction on gitops-reverser: letting the world know what it can do and why I am building it
* Connecting with people
* Getting gitops-reverser into CozyStack?
* Getting somebody that would like to use ConfigButler to prepare configuration changes (allowing policy checks, human reviews)
* hopefully learning about commercial opportunities. 

Potenial benefits for the audiance:
* Bringing GitOps within reach, provides an easier start
    * Showing that we can do this in two directions as well
    * Critical environments could be having a staging CozyStack: GitOps can help to bring it.
    * Multi environments.
* The need for auditabiliy, who did this?

Applications:
* Easier start with gitops
    * No fighting of YAML, the Kubernetes API gives a very fast answer to your questions
* Make it easier for non engineers to propose/make changes in an gitops managed environment.
* Use your GUI without feeling guilty (I should be using GitOps for this)
* Checking whats happening inside your test cluster: wouldnt it be cool if a PR is automatically created for quikcly added/installed helm charts? If it's good you can merge into prodcution
* Broader: application settings, visiblity
* Security checkups: who is changing things inside the cluster? Do we now the SA? 

Making it balanced:
* You need to get it 'all' right, I tried to make a friendly setup, but it's not easy.
* Getting TLS at all stages
* At this moment you need an api-audit-proxy -> Kubernetes auditting does only provide shallow audit logs (which gives you something, but not the complete picture).
* Using git is beatifull: it does take some engineering mindset
* Why not write it to a big file?
* Secrets are part of the story: CozyStack should really keep secrets only in specific resources. And not in the top level intent as seperate fields.