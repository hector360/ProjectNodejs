const { getTicketBySecretId } = require("../controllers/ticketController");
const { getTicketPdf } = require("../controllers/ticketController");
const { sendWhatsappTicket } = require("../controllers/ticketController");

exports.getRoutes = (router) => {
  router.get("/cart-ticket/:ticket", (req, res, next) => {
    getTicketBySecretId(req, res, next);
  });

  router.get("/ticket-pdf/:ticket", (req, res, next) => {
    getTicketPdf(req, res, next);
  });

  router.post("/send-ticket-whatsapp", (req, res, next) => {
    sendWhatsappTicket(req, res, next);
  });
};
