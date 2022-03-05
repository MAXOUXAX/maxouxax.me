<template>
	<div id="uppercasegenerator" class="my-12">
		<div class="header">
            <div class="title">
                <p id="title">UpperCaseGenerator</p>
            </div>
            <div class="divider"></div>
        </div>
        <div class="main">
            <div class="convert">
                <div class="input">
                    <p>Texte à modifier</p>
                    <textarea v-model="text" class="textarea" id="input" name="Texte à modifier" maxlength="900"></textarea>
                </div>
                <div class="output">
                    <p>Résultat</p>
                    <textarea v-model="transformText" class="resultarea" id="output" name="Résultat" readonly="readonly"></textarea>
                </div>
                <div class="clipboard">
                    <button @click="copyToClipboard()">Copier</button>
                    <br>
                    <v-icon id="clip" size="96px">mdi-check</v-icon>
                </div>
            </div>
            <div class="divider"></div>
            <div class="whycontainer">
                <div class="why">
                    <h4>Pourquoi ce site ?</h4>
                    <p class="about">UpperCaseGenerator est un mini-service vous permettant de transformer vos phrases en quelques instants dans une forme rEsSeMbLaNt à Ça :)</p>
                    <p class="about">Pour utiliser ce mini-service, il vous suffit d'écrire votre texte original dans l'emplacement prévu à cet effet, et le site se chargera de tout. Vous pourrez retrouver le résultat dans l'emplacement juste en dessous.</p>
                </div>
            </div>
        </div>
	</div>
</template>

<script>
export default {
    data: function(){
        return {
            text: ""
        }
    },
    methods: {
        copyToClipboard: function(){
            var copyText = document.getElementById("output");
            var check = document.getElementById("clip");

            copyText.select();

            document.execCommand("copy");
            check.style.transform = 'scale(1,1)';
            setTimeout(() => {
                check.style.transform = 'scale(0,0)'
            }, 1500);
        }
    },
    computed: {
        transformText: function(){
            var str = "";
            for (var i = 0; i < this.text.length; i++) {
                (i % 2) ? str = str+this.text.charAt(i).toUpperCase() : str = str+this.text.charAt(i).toLowerCase();
            }
            return str;
        }
    }
}
</script>

<style scoped>
#uppercasegenerator{
    width: 100%;
}
.title{
    color: white;
    text-align: center;
    font-family: 'Roboto', sans-serif;
    margin-bottom: 80px;
    transition: 1.4s cubic-bezier(0.86, 0, 0.07, 1);
}
#title{
    color: white;
    text-align: center;
    font-family: 'Roboto', sans-serif;
    font-size: 8vw;
    transition: 1.4s cubic-bezier(0.86, 0, 0.07, 1);
}
#title:hover{
    transform: scale(0.95, 0.95);
    transition: 1.4s cubic-bezier(0.86, 0, 0.07, 1);    
}
.made{
    text-align: center;
    color: crimson;
    text-shadow: 2px 2px 3px black;
    font-size: 5vw;
    transition: 1.4s cubic-bezier(0.86, 0, 0.07, 1);    
}
.version{
    text-align: center;
    color: white;
    font-size: 5vw;
    transition: 1.4s cubic-bezier(0.86, 0, 0.07, 1);
}
.footer{
    font-family: 'Roboto', sans-serif;
    padding: 10px;
    position: relative;
    bottom: 0;
    left: 0;
    right: 0;
    background-image: linear-gradient(#070707 , black);
    transition: 1.4s cubic-bezier(0.86, 0, 0.07, 1);
}
.footer:hover{
    box-shadow: 0px 0px 100px white;
    transition: 1.4s cubic-bezier(0.86, 0, 0.07, 1);
}
html{
    position:relative; 
    min-height: 100%;
}
html,body{
    margin:0;
    padding:0;
}
.main{
    animation-name: appearing;
    animation-duration: 2s;
}
.header{
    animation-name: appearing;
    animation-duration: 2s;
}
p{
    color: white;
    font-family: 'Roboto', sans-serif;
    font-size: 1.2rem;
    text-align: center;
}
textarea{
    margin-left: auto;
    margin-right: auto;
    width: 70vw;
    height: 250px;
    background-color: #020202;
    color: white;
    border: 1px solid #95a5a6;
    max-width: 600px;
    max-height: 400px;
    font-size: 1rem;
    font-family: 'Roboto', sans-serif;
    transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1);
}
textarea:hover{
    transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1);
}
.convert{
    padding: 50px;
    margin: 1vw;
    text-align: center;
}
.divider{
    height: 2px;
    width: 70vw;
    background-color: white;
    margin-left:auto;
    margin-right:auto;
}
.why{
    width: 50vw;
    text-align: center;
    border: 0px solid #070707;
    transition: 1.4s cubic-bezier(0.86, 0, 0.07, 1);
    box-shadow: 0px 0px 0px #070707;
    animation: wow 10s infinite;
}
.whycontainer{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-content: center;
    text-align: center;
    transition: 1s;
    padding: 1px;
    margin-top: 80px;
    margin-bottom: 80px;
}
.about{
    color: white;
    font-family: 'Roboto', sans-serif;
    font-size: 4.5vw;
    text-align: center;
    transition: 1.4s cubic-bezier(0.86, 0, 0.07, 1);
}
h4{
    color: white;
    font-size: 7vw;
    font-family: 'Roboto', sans-serif;
    text-align: center;
    transition: 1.4s cubic-bezier(0.86, 0, 0.07, 1);
}
#clip{
    transform: scale(0,0);
    color: #2ecc71;
    transition: 1.4s cubic-bezier(0.86, 0, 0.07, 1);
}
button{
    padding: 10px;
    margin: 2vw;
    margin-top: 40px;
    font-family: 'Roboto', sans-serif;
    font-size: 2rem;

    border: 1px solid #1976D2;
    box-shadow: 2px 2px 5px black;
    height: 4.5rem;
    color: #1976D2;
    background: none transparent;
    text-transform: uppercase;
    cursor: pointer;
    transition: 0.8s;
    position: relative;
    overflow: hidden;
    border-radius: 50px
}

button:hover{
    color: #fff;
    transform: scale(1.3,1.3);
    transition: 0.8s;
  }
@keyframes appearing{
    0%{
        opacity: 0;
    }
    100%{
        opacity: 100;
    }
}
@keyframes wow{
    0%{
        text-align: center;
        margin-left:auto;
        margin-right:auto;
        transition: 1s;
        padding: 50px;
        border: 0px solid #070707;
        transition: 1.4s cubic-bezier(0.86, 0, 0.07, 1);
        box-shadow: 0px 0px 0px #070707;
    }
    15%{
        text-align: center;
        margin-left:auto;
        margin-right:auto;
        padding: 50px;
        transform: scale(0.95, 0.95);
        border: 4px solid white;
        transition: 1.4s cubic-bezier(0.86, 0, 0.07, 1);
        box-shadow: 3px 3px 8px black;
    }
    30%{
        text-align: center;
        margin-left:auto;
        margin-right:auto;
        transition: 1s;
        padding: 50px;
        border: 0px solid #070707;
        transition: 1.4s cubic-bezier(0.86, 0, 0.07, 1);
        box-shadow: 0px 0px 0px #070707;
    }
}
@media screen and (min-width: 1000px) {
    h4 {
       font-size: 4rem;
    }
    .about{
        font-size: 2rem;
    }
    .made{
        font-size: 1.3rem;
    }
    .version{
        font-size: 1rem;
    }
    #title{
        font-size: 4rem;
    }
    .divider{
        width: 700px;
    }
  }
</style>