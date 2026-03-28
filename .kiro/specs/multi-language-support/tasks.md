# Implementation Plan: Multi-Language Support

## Overview

Implement a centralised i18n system for Sahayak AI supporting 11 Indian languages. The work proceeds in layers: data (translations) → context → UI component → page migrations → wiring.

## Tasks

- [ ] 1. Create the i18n translation map
  - Create `src/i18n/translations.ts` with the `LangCode` type, `SUPPORTED_LANGS` array, `TranslationKey` type, and the full `translations` object
  - Migrate all existing inline translation objects from `Index.tsx` (`content`), `LoginPage.tsx` (`UI`), `ChatPage.tsx` (`UI`), and `ResultPage.tsx` (`STATIC`) into the unified map
  - Add translations for the Navbar strings (logout label, user menu)
  - Add translations for the NotFound page strings
  - Extend coverage to all 11 languages: `en`, `hi`, `bn`, `te`, `mr`, `ta`, `gu`, `kn`, `ml`, `pa`, `or`
  - Each entry in `SUPPORTED_LANGS` must include `code`, `nativeName`, `flag`, and `speechLocale` (BCP 47)
  - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 4.1–4.11, 6.2_

  - [ ]* 1.1 Write property test: all English keys are non-empty strings
    - **Property 4: All English keys are non-empty strings**
    - **Validates: Requirements 2.2, 2.3, 2.4, 2.5, 2.6, 2.7**
    - Iterate every key in `translations["en"]` and assert the value is a non-empty string

  - [ ]* 1.2 Write property test: supported language completeness and speech locale format
    - **Property 5: Supported language completeness (translations + speech locale)**
    - **Validates: Requirements 4.1–4.11, 6.2**
    - For each entry in `SUPPORTED_LANGS`, assert `translations[code]` is a non-empty object and `speechLocale` matches `/^[a-z]{2}-[A-Z]{2}$/`

- [ ] 2. Create the LanguageContext
  - Create `src/i18n/LanguageContext.tsx` with `LanguageProvider`, `useLanguage()` hook, and the `LanguageContextValue` interface
  - On mount, read `localStorage.getItem("sahayak_lang")`; validate against `SUPPORTED_LANGS`; default to `"hi"` if missing or invalid
  - `setLanguage(code)` updates state and writes to `localStorage` (wrap write in try/catch for private browsing)
  - `t(key)` returns `translations[lang][key] ?? translations["en"][key] ?? key`
  - `useLanguage()` throws `Error("useLanguage must be used within a LanguageProvider")` when called outside the provider
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 2.8, 5.1, 5.2, 5.3, 5.4_

  - [ ]* 2.1 Write property test: language persistence round-trip
    - **Property 1: Language persistence round-trip**
    - **Validates: Requirements 3.1, 3.2**
    - Use fast-check to generate random `LangCode` values from `SUPPORTED_LANGS`; call `setLanguage(code)`; re-init context from `localStorage`; assert `lang === code`

  - [ ]* 2.2 Write property test: non-supported stored value defaults to Hindi
    - **Property 2: Non-supported stored value defaults to Hindi**
    - **Validates: Requirements 3.3, 3.4**
    - Use fast-check to generate arbitrary strings not in `SUPPORTED_LANGS` (including empty string); write to `localStorage`; init context; assert `lang === "hi"`

  - [ ]* 2.3 Write property test: translation fallback to English
    - **Property 3: Translation fallback to English**
    - **Validates: Requirements 2.8**
    - For any `TranslationKey`, create a context with a language whose map is empty; assert `t(key)` returns the English value

  - [ ]* 2.4 Write unit test: useLanguage throws outside provider
    - Render a component that calls `useLanguage()` without a `LanguageProvider` wrapper; assert it throws the expected error message
    - _Requirements: 5.4_

- [ ] 3. Create the LanguageSelector component
  - Create `src/components/LanguageSelector.tsx`
  - Render a trigger button showing the active language's `flag` + `nativeName` (read from `useLanguage()`)
  - On click, toggle a dropdown listing all `SUPPORTED_LANGS` entries
  - On item click, call `setLanguage(code)` and close the dropdown
  - Use `useRef` + `useEffect` mousedown listener for click-outside-to-close (same pattern as the existing user menu in `Navbar.tsx`)
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ]* 3.1 Write property test: selector displays active language label
    - **Property 6: LanguageSelector displays active language label**
    - **Validates: Requirements 1.1**
    - For any `LangCode` in `SUPPORTED_LANGS`, render `LanguageSelector` with that language active; assert the trigger button text contains the corresponding `nativeName`

  - [ ]* 3.2 Write unit test: dropdown closes on outside click
    - Open the dropdown; simulate `mousedown` outside the component; assert the dropdown is no longer in the DOM
    - _Requirements: 1.4_

  - [ ]* 3.3 Write unit test: selecting a language updates context and closes dropdown
    - **Property 7: Language selection updates context**
    - **Validates: Requirements 1.3, 2.1**
    - Open the dropdown; click a language item; assert `setLanguage` was called with the correct code and the dropdown is closed

- [ ] 4. Update Navbar to use LanguageSelector
  - Remove the `lang` and `onSetLang` props from `NavbarProps`
  - Import and render `<LanguageSelector />` in place of the old toggle button
  - Use `useLanguage()` to get the `t` function for the logout label and any other Navbar strings
  - _Requirements: 1.5, 2.7_

- [ ] 5. Checkpoint — ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Migrate Index (home) page to use LanguageContext
  - Remove the `lang` prop from `LandingPageProps` and the component signature
  - Call `const { t, lang } = useLanguage()` at the top of the component
  - Replace all `content[lang].xxx` lookups with `t("home.xxx")` calls using the keys defined in `translations.ts`
  - Remove the now-unused `content` object from the file
  - _Requirements: 2.2_

- [ ] 7. Migrate LoginPage to use LanguageContext
  - Remove the `lang` prop from `LoginPageProps`
  - Call `const { t } = useLanguage()` and replace all `UI[lang].xxx` lookups with `t("login.xxx")` calls
  - Remove the now-unused `UI` object from the file
  - _Requirements: 2.3_

- [ ] 8. Migrate ChatPage to use LanguageContext
  - Remove the `lang` prop from `ChatPageProps`
  - Call `const { t, lang } = useLanguage()` and replace all `UI[lang].xxx` lookups with `t("chat.xxx")` calls
  - Pass `SUPPORTED_LANGS.find(l => l.code === lang)?.speechLocale ?? "hi-IN"` to `startListening` instead of the raw `lang` string
  - Remove the now-unused `UI` object from the file
  - _Requirements: 2.4, 6.1_

- [ ] 9. Migrate ResultPage to use LanguageContext
  - Remove the `lang` derivation from `location.state`; call `const { t, lang } = useLanguage()` instead
  - Replace all `STATIC[lang].xxx` lookups with `t("result.xxx")` calls
  - Remove the now-unused `STATIC` object from the file
  - _Requirements: 2.5_

- [ ] 10. Migrate NotFound page to use LanguageContext
  - Call `const { t } = useLanguage()` and replace hardcoded English strings with `t("notFound.xxx")` calls
  - _Requirements: 2.6_

- [ ] 11. Wire LanguageProvider into App.tsx and remove prop drilling
  - Wrap `<AppRoutes>` (or the `BrowserRouter` contents) with `<LanguageProvider>`
  - Remove the `lang` / `setLang` state from `AppRoutes`
  - Remove all `lang` and `onSetLang` props passed to `<Navbar>`, `<LandingPage>`, `<LoginPage>`, and `<ChatPage>`
  - _Requirements: 5.5_

- [ ] 12. Final checkpoint — ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Property tests use **fast-check** with a minimum of 100 iterations each
- Tag format for property tests: `Feature: multi-language-support, Property {N}: {property_text}`
- The `lang` value is still needed in `ChatPage` and `ResultPage` for speech recognition locale and audio playback labels — use `useLanguage()` to get it rather than a prop
