const wordList = "https://framagit.org/JonathanMM/sutom/-/raw/main/data/mots.txt"

//const wordList = "https://maxouxax.me/assets/mots-francais.txt"

async function answerRequest(response) {
    return new Response(JSON.stringify(response, null, 2), {
        headers: {'content-type': 'application/json;charset=UTF-8'},
    })
}

export async function onRequestPost(context) {
    let words = []
    let response = {
        error: false,
        message: '',
        words: [],
    }
    let request = context.request;
    console.log("Headers: " + JSON.stringify(request.headers))
    if (!request.headers.get('content-type').includes('form')) {
        response.error = true
        response.message = 'Request content-type is not a form'
        return answerRequest(response);
    }

    const formData = await request.formData()
    if (
        !formData.has('wordPattern') ||
        !formData.has('lettersInWord') ||
        !formData.has('lettersNotInWord')
    ) {
        response.error = true
        response.message = 'Request body does not contain the needed values'
        return answerRequest(response);

    }
    await fetch(wordList, {
        cf: {
            cacheEverything: true,
            cacheTtl: '86400',
        },
    })
        .then(response => response.text())
        .catch(ignored => {
        })
        .then(data => {
            words = data.slice(0, -1).split('\n')
        })
    if (words.length === 0) {
        response.error = true
        response.message = 'Une erreur est survenue lors de la récupération des mots'
        return answerRequest(response);
    }

    let initialParameter = formData.get('wordPattern')
    let letterInParameter = formData.get('lettersInWord')
    let letterOutParameter = formData.get('lettersNotInWord')

    if (initialParameter.length === 0) {
        response.error = true
        response.message = "Le pattern initial du mot n'est pas spécifié"
        return answerRequest(response);
    }

    return answerRequest(findWord(response, words, initialParameter, letterInParameter, letterOutParameter))
}

async function findWord(response, words, initialParameter, letterInParameter, letterOutParameter) {
    let wordLength = initialParameter.length
    let wordPattern = "(?=" + initialParameter + "$)"

    let letterIn = ""

    if (letterInParameter.length !== 0) {
        letterInParameter.split("").forEach(letter => {
            letterIn += "(?=.*" + letter + ")"
        })
    }

    let letterOut = ""

    if (letterOutParameter.length !== 0) {
        letterOutParameter.split("").forEach(letter => {
            letterOut += "(?!.*" + letter + ")"
        })
    }

    let wordRegex = new RegExp(wordPattern + letterIn + letterOut + ".*")

    let matchedWords = words.filter(word => word.length === wordLength)
        .map(word => word.normalize("NFD").replace(/\p{Diacritic}/gu, ""))
        .filter(word => wordRegex.test(word))

    matchedWords.forEach(word => {
        response.words.push(word)
    })
    response.message = 'Success!'
    return response
}