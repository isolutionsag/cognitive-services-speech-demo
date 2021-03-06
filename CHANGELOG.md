# Changelog
All notable changes to this project will be documented in this file.

## v1.3.0 - 2022-04-12

### Added

- Migrate from custom routing to react-router (#12).
- Add the `region` parameter for the translator service (#12).
- Dark Mode: The application now automatically selects the light / dark mode based on the user preference (OS Setting) or manual override. (#18)

### Changed

- Cleanup the layout in preparation for future enhancements in the routing mechanism (#15).
- Update to React 18 (#17)

### Fixed 

- Downgrade Speech SDK version to fix the broken translation feature.

## v1.2.0 - 2022-03-04

### Added

- Add the MIT License (#10)

## v1.1.0 - 2022-03-02

### Added

- Currently recognizing text is displayed at bottom of paragraph history in Realtime Transcription. (#6)
- History of recorded paragraphs (#5)
- Select Recognizing language for Realtime Transcription. (#4)
- Option to recognize only Swiss German input. (#3)

### Changed

- Removed bug, that started recording when language was changed in Realtime Transcription. (#6)

### Removed

- Automatic timeout for realtime transcription. (#7)

## v1.0.0 - 2022-01-26

### Initial Release

Try out the new Swiss Natural Language Processing Voice "Leni".

Follow the instructions [here](https://github.com/isolutionsag/cognitive-services-speech-demo/tree/v1.0.0) to get started.
