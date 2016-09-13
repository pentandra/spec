# Specifications

Mostly work-in-process specifications, at various stages of development.

## Vocabularies & Goals

### Knowledge Design

* [Research Cases Data Model (W3C Unofficial Draft)](playground/knowledge-design/research-cases/index.html)

  Research Cases are a way to partition research conceptually into _cases_,
  each case organized around a question, or some sort of cognitive discordance.
  They are designed for iterative, real-time research publication, and
  encourage open collaboration and discourse throughout the research process.

  We're at the early stages of creating this ontology, and it needs more
  thought and examples, but, in general, the idea is sane.

  We would like to see Research Cases become the default way of ~~publishing~~
  doing research.

* [Research Cases Ontology (Turtle)](playground/knowledge-design/research-cases/rcases.ttl)

  The Research Cases ontology, playground edition.

### Scholarly Commons

The Scholarly Commons is not a website, nor a platform or organization, but an
information space based on common agreement of standards and principles. Partly
it is already there, with many current services, policies and standards already
fitting in, but in many respects we are also still a long way off.

[FORCE11 Scholarly Commons Working Group](https://www.force11.org/group/scholarly-commons-working-group)

## Contributing

This repository uses [Git Flow] to manage development and release activity. All
submission _must_ be on a feature branch based on the _develop_ branch to ease
staging and integration.

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
[Git Flow]: https://github.com/nvie/gitflow
