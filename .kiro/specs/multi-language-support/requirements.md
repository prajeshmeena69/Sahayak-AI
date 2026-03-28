# Requirements Document

## Introduction

Sahayak AI is an agricultural information platform for Indian farmers that helps them discover and check eligibility for government schemes. The platform currently supports Hindi and English with a simple toggle button. This feature expands language support to include major Indian regional languages and replaces the toggle with a proper language selector dropdown in the navbar. All UI text across every page and component must reflect the selected language, and the user's preference must persist across sessions.

## Glossary

- **Language_Selector**: The dropdown UI component in the navbar that allows users to choose their preferred language.
- **Language_Context**: The React context that holds the currently selected language and exposes it to all components.
- **Translation_Map**: A structured object containing all UI strings keyed by language code and string identifier.
- **Supported_Language**: Any language included in the platform's Translation_Map (English, Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Malayalam, Punjabi, Odia).
- **Language_Code**: A BCP 47 language tag used to identify a language (e.g., `en`, `hi`, `bn`, `te`, `mr`, `ta`, `gu`, `kn`, `ml`, `pa`, `or`).
- **Persistence_Store**: The browser's `localStorage`, used to save the user's language preference.
- **UI_String**: Any piece of user-visible text rendered in the application interface.

---

## Requirements

### Requirement 1: Language Selector Dropdown

**User Story:** As a farmer using Sahayak AI, I want to select my preferred language from a dropdown in the navbar, so that I can use the app in the language I am most comfortable with.

#### Acceptance Criteria

1. THE Language_Selector SHALL display the currently active language's native name and flag emoji as its label.
2. WHEN a user clicks the Language_Selector, THE Language_Selector SHALL display a dropdown list of all Supported_Languages, each showing its native name and flag emoji.
3. WHEN a user selects a language from the dropdown, THE Language_Selector SHALL close the dropdown and update the active language to the selected one.
4. WHEN a user clicks outside the Language_Selector dropdown, THE Language_Selector SHALL close the dropdown without changing the active language.
5. THE Language_Selector SHALL replace the existing Hindi/English toggle button in the navbar.

---

### Requirement 2: Full UI Translation

**User Story:** As a farmer using Sahayak AI, I want all text on the website to appear in my selected language, so that I can understand every part of the interface without confusion.

#### Acceptance Criteria

1. WHEN a language is selected, THE Language_Context SHALL update the active language and all pages SHALL re-render with UI strings from the corresponding Translation_Map entry.
2. THE Translation_Map SHALL contain translations for all UI strings on the Index (home) page.
3. THE Translation_Map SHALL contain translations for all UI strings on the LoginPage.
4. THE Translation_Map SHALL contain translations for all UI strings on the ChatPage.
5. THE Translation_Map SHALL contain translations for all UI strings on the ResultPage.
6. THE Translation_Map SHALL contain translations for all UI strings on the NotFound page.
7. THE Translation_Map SHALL contain translations for all UI strings in the Navbar component (including the logout button and user menu).
8. IF a translation for a UI_String is missing for the selected language, THEN THE Language_Context SHALL fall back to the English translation for that string.

---

### Requirement 3: Language Persistence

**User Story:** As a farmer using Sahayak AI, I want my language preference to be remembered between visits, so that I don't have to re-select my language every time I open the app.

#### Acceptance Criteria

1. WHEN a user selects a language, THE Language_Context SHALL save the selected Language_Code to the Persistence_Store under the key `sahayak_lang`.
2. WHEN the application initialises, THE Language_Context SHALL read the Language_Code from the Persistence_Store and set it as the active language.
3. IF no Language_Code is found in the Persistence_Store on initialisation, THEN THE Language_Context SHALL default to Hindi (`hi`).
4. IF the Language_Code stored in the Persistence_Store is not a valid Supported_Language code, THEN THE Language_Context SHALL default to Hindi (`hi`).

---

### Requirement 4: Supported Languages

**User Story:** As an Indian farmer, I want to use Sahayak AI in my regional language, so that I can access agricultural scheme information in the language I speak at home.

#### Acceptance Criteria

1. THE Translation_Map SHALL include translations for English (`en`).
2. THE Translation_Map SHALL include translations for Hindi (`hi`).
3. THE Translation_Map SHALL include translations for Bengali (`bn`).
4. THE Translation_Map SHALL include translations for Telugu (`te`).
5. THE Translation_Map SHALL include translations for Marathi (`mr`).
6. THE Translation_Map SHALL include translations for Tamil (`ta`).
7. THE Translation_Map SHALL include translations for Gujarati (`gu`).
8. THE Translation_Map SHALL include translations for Kannada (`kn`).
9. THE Translation_Map SHALL include translations for Malayalam (`ml`).
10. THE Translation_Map SHALL include translations for Punjabi (`pa`).
11. THE Translation_Map SHALL include translations for Odia (`or`).

---

### Requirement 5: Language Context Provider

**User Story:** As a developer, I want a centralised language context, so that any component in the app can access the current language and translations without prop drilling.

#### Acceptance Criteria

1. THE Language_Context SHALL expose the current Language_Code to all child components.
2. THE Language_Context SHALL expose a `setLanguage` function that accepts a Language_Code and updates the active language.
3. THE Language_Context SHALL expose a `t` (translate) function that accepts a string key and returns the corresponding UI_String for the active language.
4. WHEN the Language_Context is used outside of its provider, THE Language_Context SHALL throw a descriptive error.
5. THE Language_Context SHALL wrap the entire application so that all pages and components can consume it.

---

### Requirement 6: Speech Recognition Language Binding

**User Story:** As a farmer using voice input, I want the speech recognition to use my selected language, so that my spoken words are correctly transcribed.

#### Acceptance Criteria

1. WHEN a user initiates voice input on the ChatPage, THE ChatPage SHALL pass the currently active Language_Code to the speech recognition utility.
2. THE Translation_Map SHALL include the BCP 47 speech recognition locale for each Supported_Language (e.g., `hi-IN`, `en-IN`, `ta-IN`).
