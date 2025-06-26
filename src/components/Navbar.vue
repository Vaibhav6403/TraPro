<template>
    <div class="navbar">
        <div class="navbar-pri">
            <ul>
                <li>Family</li>
                <li>Adventure</li>
                <li>Solo</li>
                <li>Date</li>
                <li>All</li>
            </ul>
        </div>
        <div class="navbar-sec">

        </div>
    </div>
</template>
<script setup>

</script>
<style scoped>
.navbar{
    position: fixed;
    z-index: 500;
    width: 100%;
    background-color: black;
    color: white;
    padding: 15px 20px;
}
    .navbar-pri ul{
        list-style: none;
        padding: 0;
        margin: 0;
        top: 0;
        position: fixed;
        display: flex;
       width: 50%;
        justify-content: space-around;
        padding: 2px 5px
    }
</style>