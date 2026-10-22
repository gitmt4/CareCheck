# CareCheck — judge walkthrough

This walkthrough uses fictional demo data. It demonstrates existing interactions, not an operational multiuser care service.

## Access

- Hosted prototype: https://carecheck-family.brawnypine2.chatgpt.site
- Hosted access is restricted to authorized accounts. The presenter must arrange access for judges; this document does not imply that the link is public.
- For source review without hosted permission, follow the README’s local setup and select **Demo**.
- The source package includes all fixed audio clips and tests. It contains no saved household database, user uploads, or account credentials.

## Suggested three-minute demo

1. **Set context.** Explain the problem: family members abroad want an accessible way to stay involved in relatives’ everyday routines.
2. **Select Demo.** Grandma and Grandpa appear with sample check-ins. Demo time is deliberately fixed to 1:45 p.m. India time for a repeatable scenario.
3. **Try the elder view.** Choose **Open grandparent view → Grandpa**. Give the in-app sharing consent, then choose Tablets or Meals. Play a Telugu prompt; optionally switch audio to Tamil or English. Select an answer and confirm it. Show the correction option.
4. **Show the dashboard.** Return to the family dashboard in the same browser session and show the updated self-report. Do not describe this as a demonstration of separate-account synchronization.
5. **Show medication setup.** In **Health records → Medications**, add a fictional “Sample medicine” with a test time and copied/sample dose instructions. Show the linked check-in in Daily schedules. Avoid configuring an extra general tablet entry as though it were another prescribed dose.
6. **Show optional organization features.** Create a fictional doctor visit or upload a synthetic report. Recording is optional and needs microphone permission and consent from everyone recorded; preview the audio before saving.
7. **Explain calling.** Settings accepts named FaceTime contacts; an elder chooses whom to call. Only trigger an actual call to a consenting test recipient. Do not enter someone else’s number just to populate the demo.
8. **State boundaries.** Account sharing, automatic dashboard sync, background alerts, real medication verification, and clinical interpretation are not implemented.

## Demo reset and persistence

Refresh or Reset demo restores the sample scenario. Demo medications, visits, and check-ins are temporary. Demo contacts are retained in that browser tab, including across a refresh. Saved My family records are separate and scoped to each signed-in account.

## Evidence to attach to the submission

- A short video of the actual working prototype, with synthetic information only.
- A source repository URL that judges can open without the author’s credentials (public source or explicit reviewer access).
- The README, architecture, limitations, and AI/third-party disclosures.
- Actual usability findings if available; do not infer improved health outcomes from a software demo.

## Device checks still to perform

On an iPhone, verify Telugu/Tamil playback, readable medication times, larger text, FaceTime handoff, upload picker, microphone permission denial, recording playback, and refresh behavior. Test two devices separately if making any cross-device claim. Keep the app open when testing foreground prompts.

## Current verification

28 automated tests and TypeScript checking passed on October 22, 2026. These checks cover logic and selected file/audio handling. They do not certify iPhone compatibility, pronunciation, accessibility compliance, security, or clinical safety.
