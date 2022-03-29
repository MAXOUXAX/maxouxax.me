const wordList =
  'https://framagit.org/JonathanMM/sutom/-/raw/main/data/mots.txt'

  /**
 * Handles the findWord endpoint
 * @param {Request} request
 */
export async function onRequestPost(request) {
  let words = []
  let response = {
    error: false,
    message: '',
    words: [],
  }
  if (!request.headers.get('content-type').includes('form')) {
    response.error = true
    response.message = 'Request content-type is not a form'
  }
  if (!response.error) {
    const formData = await request.formData()
    if (
      !formData.has('wordPattern') ||
      !formData.has('lettersInWord') ||
      !formData.has('lettersNotInWord')
    ) {
      response.error = true
      response.message = 'Request body does not contain the needed values'
    } else {
      await fetch(wordList, {
        cf: {
          cacheEverything: true,
          cacheTtl: '86400',
        },
      })
        .then(response => response.text())
        .catch(e => {
          response.error = true
          response.message =
            'Une erreur est survenue lors de la récupération des mots'
        })
        .then(data => {
          words = data.slice(0, -1).split('\n')
        })

      let initial = formData.get('wordPattern')
      let letterIn = formData.get('lettersInWord')
      let letterOut = formData.get('lettersNotInWord')

      let lengthOfWord = initial.length

      initial = new RegExp(initial)

      if (letterIn.length === 0) {
        letterIn = new RegExp('.*')
      } else {
        let temp = ''
        for (let i = 0; i < letterIn.length; i++) {
          temp += '(?=.*' + letterIn.charAt(i) + ')' + '.+'
        }
        letterIn = new RegExp(temp)
      }

      if (letterOut.length === 0) {
        letterOut = new RegExp('!.*')
      } else {
        letterOut = new RegExp('[' + letterOut + ']')
      }

      words.forEach(word => {
        word = word.normalize("NFD").replace(/\p{Diacritic}/gu, "")
        if (word.length === lengthOfWord)
          if (initial.test(word))
            if (letterIn.test(word))
              if (!letterOut.test(word)) {
                response.words.push(word)
                response.message = 'Success!'
              }
      })
    }
  }
  return new Response(JSON.stringify(response, null, 2), {
    headers: { 'content-type': 'application/json;charset=UTF-8' },
  })
}

  