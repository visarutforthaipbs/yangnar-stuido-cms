# Company profile integration

Source: Yangnar Company Profile 2026, extracted pack supplied by the client (63 slides). English single-page scope retained.

## Initial selection

Baan Tita (pp24–26), Kha-nam Noi (pp18–20), Thingamajiggy (pp42–43), Sala Yangnar (pp36–37), Yong House (pp51–53), Baan Sri-Inpun landscape (pp54–55). Six gallery photographs per project. Other projects remain outside the initial selection; Pham appears in activities.

Project summaries use supplied facts. Unsupported mock material lists and project stories were removed. Baan Tita uses the project detail's 2021 provisionally; the timeline says 2022. Kha-nam Noi uses 2019 provisionally; its timeline says 2018. Sri-Inpun has no confirmed completion year. Confirm these with the client before launch.

Images are compressed PDF extracts, suitable for review. Replace hero images with original photography and obtain the original logo and photographer credits before final publication. No construction drawings imported.

## CMS changes

Website settings now include founder portraits, philosophy images, craft image, services and publication images. Projects use existing gallery fields. Recognition has a hide-pending-verification switch. Unsubstantiated mock Yong House and generic UNESCO recognitions are hidden, not deleted. Existing valid recognition records remain visible.

## Import

`npx sanity exec sanity/scripts/importProfileContent.ts --with-user-token`

This command writes to the configured Sanity dataset. It backs up existing content documents to ignored `.sanity/backups/`, uploads/reuses profile images, patches the selected documents and hides the two old demo projects from selected works. It preserves unrelated document fields but replaces the mapped content fields: do not rerun after editorial changes without reviewing differences. The source manifest is `sanity/profile-content.json`; local images are in `public/profile/`.

The public frontend and hosted Studio require deployment to expose the new UI. CMS content changes are shared with the existing production frontend immediately through its normal cache cycle. Inquiry remains the existing unsent preview and needs delivery integration separately.
