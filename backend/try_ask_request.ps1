Invoke-RestMethod -Uri http://localhost:8000/api/ask `
-Method POST `
-Headers @{ "Content-Type" = "application/json" } `
-Body '{"question": "Why should I hire this person"}'