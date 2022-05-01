<template>
    <div id="app" class="container is-max-desktop">
        <RouterView/>
    </div>
</template>

<style>
/* Imports the Inter font from Google */
/* noinspection CssUnknownTarget */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap");

html {
    background-color: #1A2434;
}

* {
    font-family: "Inter", sans-serif;
}

.title {
    color: #F8FAFC;
    font-weight: 900;
}

.button {
    border-radius: 10px;
}

.breadcrumb li.is-active a {
    color: #F8FAFC;
}

.breadcrumb li + li::before {
    color: #F8FAFC;
}

.breadcrumb a {
    color: #0AA5E9;
    font-weight: 700;
}

.breadcrumb a:hover {
    color: #0AA5E9;
}

.section {
    padding: 0 5px 5px;
}

.container {
    padding: 40px 5px 5px;
}
</style>
