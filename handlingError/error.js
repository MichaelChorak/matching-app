// error constructor wordt aangemaakt 
class ErrorHandler extends Error {
    constructor(statusCode, message) {
      super();
      this.statusCode = statusCode;
      this.message = message;
    }
  }

  //functie waarin een error wordt meegenomen
  // gebruiker krijg dit te zien
  const handleError = (err, res) => {
    const { statusCode, message } = err;
    res.status(statusCode).json({
      status: "error, sorry its not working",
      statusCode,
      message
    });
  };

  //module bijwerken
  module.exports = {
    ErrorHandler,
    handleError
  };

  //https://dev.to/nedsoft/central-error-handling-in-express-3aej