import TicketService from '../src/pairtest/TicketService.js';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest.js';
import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException.js';

describe('TicketService', () => {
  let ticketService;

  beforeEach(() => {
    // create a new TicketService instance before each test
    ticketService = new TicketService();
  });

  describe('purchaseTickets', () => {
    it('should throw InvalidPurchaseException if no tickets are requested', () => {
      const accountId = 123;

      expect(() => ticketService.purchaseTickets(accountId)).toThrowError(InvalidPurchaseException);
    });

    it('should throw InvalidPurchaseException if too many tickets are requested', () => {
      const accountId = 123;

      const adultTickets = new TicketTypeRequest('ADULT', 10);
      const childTickets = new TicketTypeRequest('CHILD', 10);
      const infantTickets = new TicketTypeRequest('INFANT', 10);

      expect(() => ticketService.purchaseTickets(accountId, adultTickets, childTickets, infantTickets)).toThrowError(InvalidPurchaseException);
    });

    it('should be valid number of seats if infant exist with adult', () => {
      const accountId = 123;

      const adultTickets = new TicketTypeRequest('ADULT', 2);
      const childTickets = new TicketTypeRequest('CHILD', 2);
      const infantTickets = new TicketTypeRequest('INFANT', 2);

      const output =  ticketService.purchaseTickets(accountId, adultTickets, childTickets, infantTickets);
      expect(output.seats).toBe(4);
    });

    it('should throw TypeErrorException if provide invalid account id', () => {
      const accountId = "ttdd";

      const adultTickets = new TicketTypeRequest('ADULT', 2);
      const childTickets = new TicketTypeRequest('CHILD', 2);
      const infantTickets = new TicketTypeRequest('INFANT', 2);

      expect(() => ticketService.purchaseTickets(accountId, adultTickets, infantTickets, childTickets)).toThrow(TypeError);
    });

    it('should throw exception if provide invalid seats count provided', () => {

      expect(() => new TicketTypeRequest('ADULT', "ggh")).toThrow(TypeError);
    });

    it('should throw InvalidPurchaseException if an infant ticket is requested without an adult ticket', () => {
      const accountId = 123;

      const infantTickets = new TicketTypeRequest('INFANT', 1);
      const childTickets = new TicketTypeRequest('CHILD', 1);

      expect(() => ticketService.purchaseTickets(accountId, infantTickets, childTickets)).toThrowError(InvalidPurchaseException);
    });
  });
});
