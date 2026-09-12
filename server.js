// SkillTree local server
// - Serves the app's static files
// - Proxies AI requests to Gemini
// - Keeps the Gemini API key on the server
// - Uses different Gemini models for different features

require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY;

// Serve JSON requests
app.use(express.json({ limit: '2mb' }));

// Serve SkillTree files
app.use(express.static(__dirname));

// Open SkillTree as the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'skilltree-app.html'));
});
// ==================================================
// AI / GEMINI ENDPOINT
// ==================================================

app.post('/api/mentor', async (req, res) => {

  // ------------------------------------------------
  // 1. Check Gemini API key
  // ------------------------------------------------

  if (!API_KEY) {
    return res.status(500).json({
      error: {
        message:
          'Server is missing GEMINI_API_KEY. Add it to a .env file next to server.js.'
      }
    });
  }


  // ------------------------------------------------
  // 2. Get request data from frontend
  // ------------------------------------------------

  const { system, messages } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({
      error: {
        message: 'messages array is required'
      }
    });
  }


  try {

    // ------------------------------------------------
    // 3. Detect which feature is making the request
    // ------------------------------------------------

    const isResumeScan =
      typeof system === 'string' &&
      system.toLowerCase().includes('resume') &&
      system.toLowerCase().includes('json');


    // ------------------------------------------------
    // 4. Select Gemini model
    // ------------------------------------------------

    let model;

    if (isResumeScan) {

      // Resume Scanner
      model = 'gemini-3.5-flash-lite';

    } else {

      // AI Mentor
      model = 'gemini-3.5-flash';

    }


    console.log('');
    console.log('====================================');
    console.log('SkillTree AI Request');
    console.log('====================================');

    console.log(
      'Feature:',
      isResumeScan ? 'Resume Scanner' : 'AI Mentor'
    );

    console.log(
      'Model:',
      model
    );


    // ------------------------------------------------
    // 5. Convert frontend messages to Gemini format
    // ------------------------------------------------

    const contents = messages.map(message => ({

      role:
        message.role === 'assistant'
          ? 'model'
          : 'user',

      parts: [
        {
          text: String(message.content || '')
        }
      ]

    }));


    // ------------------------------------------------
    // 6. Create Gemini request body
    // ------------------------------------------------

    const requestBody = {

      contents: contents,

      generationConfig: {

        maxOutputTokens:
          isResumeScan
            ? 2000
            : 1000

      }

    };


    // ------------------------------------------------
    // 7. Add system instruction
    // ------------------------------------------------

    if (system) {

      requestBody.systemInstruction = {

        parts: [
          {
            text: String(system)
          }
        ]

      };

    }


    // ------------------------------------------------
    // 8. Force JSON output for Resume Scanner
    // ------------------------------------------------

    if (isResumeScan) {

      requestBody.generationConfig.responseMimeType =
        'application/json';

    }


    // ------------------------------------------------
    // 9. Call Gemini API
    // ------------------------------------------------

    console.log('Sending request to Gemini...');

    const response = await fetch(

      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,

      {

        method: 'POST',

        headers: {

          'Content-Type': 'application/json',

          'x-goog-api-key': API_KEY

        },

        body: JSON.stringify(requestBody)

      }

    );


    // ------------------------------------------------
    // 10. Read Gemini response
    // ------------------------------------------------

    const data = await response.json();

    console.log(
      'Gemini API status:',
      response.status
    );


    // ------------------------------------------------
    // 11. Handle Gemini API errors
    // ------------------------------------------------

    if (!response.ok) {

      console.error(
        'Gemini API error:',
        JSON.stringify(data, null, 2)
      );

      return res.status(response.status).json({

        error: {

          message:
            data?.error?.message ||
            'Gemini API request failed.'

        }

      });

    }


    // ------------------------------------------------
    // 12. Extract generated text
    // ------------------------------------------------

    const text =

      data?.candidates?.[0]?.content?.parts
        ?.map(part => part.text || '')
        .join('') || '';


    console.log(
      'Gemini response:',
      text.substring(0, 500)
    );


    // ------------------------------------------------
    // 13. Check for empty response
    // ------------------------------------------------

    if (!text) {

      return res.status(502).json({

        error: {

          message:
            'Gemini returned an empty response.'

        }

      });

    }


    // ------------------------------------------------
    // 14. Return response in the format expected
    //     by your existing SkillTree frontend
    // ------------------------------------------------

    return res.json({

      content: [

        {

          type: 'text',

          text: text

        }

      ]

    });


  } catch (err) {

    // ------------------------------------------------
    // 15. Network/server error
    // ------------------------------------------------

    console.error(
      'Gemini API request failed:',
      err
    );

    return res.status(502).json({

      error: {

        message:
          'Failed to reach Gemini API from the server.'

      }

    });

  }

});


// ==================================================
// START SERVER
// ==================================================

app.listen(PORT, () => {

  console.log('');

  console.log(
    '===================================='
  );

  console.log(
    '       SkillTree server running'
  );

  console.log(
    '===================================='
  );

  console.log('');

  console.log(
    `Local URL: http://localhost:${PORT}`
  );

  console.log(
    `App URL: http://localhost:${PORT}/skilltree-app.html`
  );

  console.log('');

});