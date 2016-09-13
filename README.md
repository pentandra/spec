# Specifications

> — Everything written symbols can say has already passed by. They are like
> tracks left by animals. That is why the masters of meditation refuse to
> accept that writings are final. The aim is to reach true being by means of
> those tracks, those letters, those signs—but reality itself is not a sign,
> and it leaves no tracks. It doesn’t come to us by way of letters or words. We
> can go toward it, by following those words and letters back to what they came
> from. But so long as we are preoccupied with symbols, theories and opinions,
> we will fail to reach the principle.  
> — But when we give up symbols and opinions, aren’t we left in the utter
> nothingness of being?  
> — Yes.
>
> Kimura Kyũho, _Kenjutsu Fushigi Hen_, 1768

The specifications, vocabularies, ontologies, and examples in this repository
are designed to enrich our abilities to share knowledge, opinion, and
experience in our collective quest for greater light and understanding.

These specifications are not intended to stand alone, isolated and independent,
but to be refined over time through use in web applications and open research
systems and platforms, and designed for practical, everyday use.

## Vocabularies & Goals

### Knowledge Design

* [Research Cases Data Model (W3C Unofficial Draft)](playground/knowledge-design/research-cases/index.html)

  Research Cases are a way to partition research conceptually into _cases_,
  each case organized around a question (or some other sort of cognitive
  discordance). They are designed for iterative, real-time research
  publication, and encourage open collaboration and discourse throughout the
  research process.

  We’re at the early stages of creating this ontology, and it needs more
  thought and examples, but, in general, the idea is sane.

  We would like to see Research Cases become the default way of ~~publishing~~
  doing research.

  See https://researchcases.org/ for more background.

* [Research Cases Ontology (Turtle)](playground/knowledge-design/research-cases/rcases.ttl)

  The Research Cases ontology, playground edition.

### Scholarly Commons

The Scholarly Commons is not a website, nor a platform or organization, but an
information space based on common agreement of standards and principles. Partly
it is already there, with many current services, policies and standards already
fitting in, but in many respects we are also still a long way off.

[FORCE11 Scholarly Commons Working Group](https://www.force11.org/group/scholarly-commons-working-group)

## Contributing

This repository uses the lightweight [GitHub Flow] to manage development and
release activity. All submissions _must_ be on a feature branch based on the
_master_ branch to ease review and integration.

* Do your best to adhere to the existing coding conventions and idioms.
* Don’t use hard tabs, and don’t leave trailing whitespace on any line. Before committing, run `git diff --check` to make sure of this.

## License

All specifications, vocabularies, ontologies, examples within this repository
are licensed under a [CC0 license], unless specified otherwise. Feel free to
use any way you like.

## Pipeline

These specifications are pulled into the publication pipeline for the
[LifePreserver project][lifepreserver] as a git submodule. If you are only
contributing to the specifications herein, you should only need to fork and
contribute to [this repository] to collaborate (this was the primary motivation
behind separating these specifications from the main project this way).

[lifepreserver]: https://github.com/pentandra/lifepreserver
[this repository]: https://github.com/pentandra/specifications
[CC0 license]: https://creativecommons.org/publicdomain/zero/1.0/
[GitHub Flow]: https://guides.github.com/introduction/flow/
