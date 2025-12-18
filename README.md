Directory structure:
└── taro112233-med-taro/
    ├── README.md
    ├── components.json
    ├── eslint.config.mjs
    ├── middleware.ts
    ├── next.config.ts
    ├── package.json
    ├── pnpm-lock.yaml
    ├── postcss.config.mjs
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── [id]/
    │   │   └── page.tsx
    │   ├── api/
    │   │   ├── admissions/
    │   │   │   ├── route.ts
    │   │   │   └── [id]/
    │   │   │       └── route.ts
    │   │   ├── patients/
    │   │   │   ├── route.ts
    │   │   │   └── [id]/
    │   │   │       └── route.ts
    │   │   └── progress-notes/
    │   │       ├── route.ts
    │   │       └── [id]/
    │   │           └── route.ts
    │   └── dashboard/
    │       └── page.tsx
    ├── components/
    │   ├── dashboard/
    │   │   ├── add-patient-dialog.tsx
    │   │   ├── patient-card.tsx
    │   │   ├── search-bar.tsx
    │   │   └── status-filter.tsx
    │   ├── patient-detail/
    │   │   ├── add-admission-dialog.tsx
    │   │   ├── add-progress-note-dialog.tsx
    │   │   ├── admission-section.tsx
    │   │   ├── patient-header.tsx
    │   │   ├── progress-note-card.tsx
    │   │   └── progress-notes-section.tsx
    │   └── ui/
    │       ├── accordion.tsx
    │       ├── alert-dialog.tsx
    │       ├── alert.tsx
    │       ├── aspect-ratio.tsx
    │       ├── avatar.tsx
    │       ├── badge.tsx
    │       ├── breadcrumb.tsx
    │       ├── button.tsx
    │       ├── calendar.tsx
    │       ├── card.tsx
    │       ├── carousel.tsx
    │       ├── chart.tsx
    │       ├── checkbox.tsx
    │       ├── collapsible.tsx
    │       ├── command.tsx
    │       ├── context-menu.tsx
    │       ├── dialog.tsx
    │       ├── drawer.tsx
    │       ├── dropdown-menu.tsx
    │       ├── ExcelExportButton.tsx
    │       ├── form.tsx
    │       ├── hover-card.tsx
    │       ├── input-otp.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── menubar.tsx
    │       ├── navigation-menu.tsx
    │       ├── pagination.tsx
    │       ├── popover.tsx
    │       ├── progress.tsx
    │       ├── radio-group.tsx
    │       ├── resizable.tsx
    │       ├── scroll-area.tsx
    │       ├── select.tsx
    │       ├── separator.tsx
    │       ├── sheet.tsx
    │       ├── sidebar.tsx
    │       ├── skeleton.tsx
    │       ├── slider.tsx
    │       ├── sonner.tsx
    │       ├── switch.tsx
    │       ├── table.tsx
    │       ├── tabs.tsx
    │       ├── textarea.tsx
    │       ├── toast.tsx
    │       ├── toaster.tsx
    │       ├── toggle-group.tsx
    │       ├── toggle.tsx
    │       └── tooltip.tsx
    ├── hooks/
    │   ├── use-auth.ts
    │   └── use-mobile.ts
    ├── lib/
    │   ├── db.ts
    │   ├── types.ts
    │   └── utils.ts
    └── prisma/
        └── schema.prisma