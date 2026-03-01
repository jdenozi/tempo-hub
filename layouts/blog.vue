<template>
  <div class="min-h-screen flex flex-col">
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:rounded-card">
      {{ $t('common.skipToContent') }}
    </a>
    <LayoutHeader />
    <main id="main-content" class="flex-1">
      <div class="container-page section-padding">
        <div class="max-w-4xl mx-auto">
          <slot />
        </div>
      </div>
    </main>
    <LayoutFooter />
  </div>
</template>
