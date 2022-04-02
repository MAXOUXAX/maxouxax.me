<template>
  
</template>

<script>
export default {
	name: 'Scrollbar'
}
</script>

<style>
:root {
  --primary-color: #4a69bd;
  --secondary-color: #6a89cc;
  --text-color-on-selection: white;
  --scrollbar-color: #4a69bd70;
  --scrollbar-border-color: #6a89cc70;
}
::selection {
    -webkit-text-fill-color: var(--text-color-on-selection);
    color: white;
    background: var(--secondary-color);
}
::-webkit-scrollbar {
    background: transparent;
    width: 20px;
    height: 20px;
}
::-webkit-scrollbar-thumb:hover{
    box-shadow: var(--scrollbar-color) 0px 0px 0px 1px inset, var(--secondary-color) 0px 0px 0px 8px inset;
}
::-webkit-scrollbar-corner {
    background: transparent;
}
::-webkit-scrollbar-thumb {
    border-width: 0px 4px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0);
    border-image: initial;
    border-radius: 9px / 4px;
    box-shadow: var(--scrollbar-border-color) 0px 0px 0px 2px inset, var(--scrollbar-color) 0px 0px 0px 8px inset;
}
::-webkit-scrollbar-track-piece {
    margin: 4px 0px;
}
</style>