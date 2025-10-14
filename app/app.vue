<!-- app/app.vue -->
<template>
  <div>
    <header>
      <h1>My Nuxt App</h1>
      <nav>
        <NuxtLink to="/">Home</NuxtLink> |
        <NuxtLink to="/about">About</NuxtLink>
      </nav>
    </header>

    <main>
      <!-- ページがここにレンダリングされる -->
      <NuxtPage />
    </main>

    <footer>
      <p>© 2025 My App</p>
    </footer>
  </div>
</template>
