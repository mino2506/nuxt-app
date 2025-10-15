<!-- app/app.vue -->
<template>
  <div>
    <header>
      <h1>My Nuxt App</h1>
      <nav>
        <NuxtLink to="/contents">List</NuxtLink> |
        <NuxtLink to="/contents/new">Create</NuxtLink>
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
