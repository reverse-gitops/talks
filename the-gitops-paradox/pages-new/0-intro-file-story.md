The GitOps Paradox: Why Your Devs Need an API You Don't Want to Build

Who am I?

I love GitOps

and I'm not going to revert reverse
I'm suggesting a pattern to augment it -> a different write path

"Yeah I to run a workload with a database: Oef now I need to create a PR and get the YAML right" -> I guess that you failed if that's the response

Why can I reverse GitOps?

Short movie of RC plane build and flown by my son
    It flies and lands nicely
    Consider this is a test: does my plan fly?
    I would love your feedback

I have a confession to make: I just like working with files, I like to review them, to search and replace, working in my own favourite editor. Why wouldnt my customers? Turns out that you also have humans that need a bit more.

What's to show?
* A manifest (https://reversegitops.dev/)
* An concrete open source operator
    I have a operator that can reconcile from K8s->Git
        Hence the name: configbutler/gitops-reverser
        Could have been: k8s-recorder, kflip etc.
* Somebody that quit his job to pursue this

Who knows the Kubernetes Resource Model? KRM
It is briliant -> you can define all your intent, but it's not easy approachabl

Demo 1: voting on the Kubernetes API
    API first
    Scan a QR code
    Show watch command, start with defining the session and showing that there is state.
    SHowing that we can authenticate -> How git can store that
    The Kubernetes Resource Model
        API call == manifest file
        File locations and names are not relevant
        labels and annotations offer a beatiful way to steer
    Showing the files in gitea

Demo 2: deploying a simple application
    Capture intent
    How can you capture intent?

Demo 3: staging that deployment
    GitOps applies

Feedback
    Contact me later
    A second round of voting: would you even use it?
    What would flip it?
    Would you be open to talk about it?
    e-mail (not required)

Q&A

---

I assume that we are talking about platform engineering: offering your cusomers (devs, customers) a way to use nice stuff without having to think about to much details. You also don't want to simplify it to much: they can help themselves (self-service). You are essentialy building/buying/integrating a product.

Story telling on "all is a file". The combination of a software engineer / architect that got heaviyl impressed by GitOps.

Why am I doing this?
What did we tried to achieve
Each customer had their own individual tenant, so their own database instance, their own buckets, their own deployments, their own namespace or even cluster etc.
This off course shouts to be templated -> you also want to capture the essence. The intent: I'm a customer, I want this and this enabled.

Create new customers
Capture the componentnes that they need
Capture their settings (authorization). There is overlap with our cloud native tooling -> so why not store this stuff in a file?

One of the best moments was a demo where we committed this single intent file -> The whole customer tenant was completly running within minutes.

But why are you doing this? Why are you going that way?

Because I'm influenced by the great 4 commendments of GitOps. But why do we keep it for the select group of people that know about the git repo? Why not putting it broader? And why not making it bigger than git itself. Get an API on top of it please.

---

This was hard

Building an API directly on top of git and GitHub is not really what you want
Visibility is great
Perhaps it's just not the right angle
Not the right focus. 
There want to much tooling to get it right.
Just push it to a database.

What kind of mistakes did we make?

Just writing it to a yaml file, but not storing the schema, not having a seperated way to filter, building authorization stuff as we went. 

This is most certainly not a 

Nothing wrong with databases, but


Turns out that I missed one thing:

The Kubernetes API itself is great: it's by far the best REST Api i have ever seen.

But I missed one thing: we never should have build our own API directly serving from files. There is to many things that can go wrong. There must be an intermediate layer that has flexiblity.

The Paradox is that we are working so hard to hide Kubernetes (perceived!) complexity behind a little file. But the Kubernetes API itself is not 'hard'. It's a very clean database driven implementation that does a lot of good things: authentication, authroization, flexible, operator driven etc.


