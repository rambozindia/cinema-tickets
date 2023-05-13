import TicketService from './src/pairtest/TicketService.js';
import TicketTypeRequest from './src/pairtest/lib/TicketTypeRequest.js';
import InvalidPurchaseException from './src/pairtest/lib/InvalidPurchaseException.js';

// create an instance of TicketService
const ticketService = new TicketService();

// example usage: purchase tickets for account with id 123
const accountId = 123;

// create TicketTypeRequest objects for the tickets to purchase
const adultTickets = new TicketTypeRequest('ADULT', 2);
const childTickets = new TicketTypeRequest('CHILD', 2);
const infantTickets = new TicketTypeRequest('INFANT', 2);


try {
  // attempt to purchase the tickets using the ticket service
  const output = ticketService.purchaseTickets(accountId, adultTickets, childTickets, infantTickets);
  console.log(output);

  console.log('Tickets purchased successfully!');
} catch (e) {
  if (e instanceof InvalidPurchaseException) {
    console.error('Invalid purchase request:', e.message);
  } else {
    console.log(e.name);
    console.error('An error occurred while purchasing tickets:', e.message);
  }
}
