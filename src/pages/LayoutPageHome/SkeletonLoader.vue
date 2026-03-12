<template>

<div class="skeleton-row">

<div
v-for="i in 8"
:key="i"
class="skeleton-card"
/>

</div>

</template>

<style scoped>

.skeleton-row{

display:flex;

gap:14px;

}

.skeleton-card{

width:160px;

height:240px;

background:linear-gradient(
90deg,
#1a1a1a 25%,
#2a2a2a 37%,
#1a1a1a 63%
);

background-size:400% 100%;

animation:skeleton 1.4s infinite;

border-radius:6px;

}

@keyframes skeleton{

0%{
background-position:100% 0
}

100%{
background-position:-100% 0
}

}

</style>