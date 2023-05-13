import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';

export default class TicketService {
  #ticketPrices = {
    INFANT: 0,
    CHILD: 10,
    ADULT: 20
  };
  
  #maxNoOfTickets = 20;
  
  purchaseTickets(accountId, ...ticketTypeRequests) {
    // Validate the purchase request

    this.#validatePurchaseRequest(ticketTypeRequests);
    
    // Calculate the total amount and no of seats
    let totalAmount = 0;
    let noOfSeats = 0;
    for (const ticketTypeRequest of ticketTypeRequests) {
      const ticketType = ticketTypeRequest.getTicketType();
      const noOfTickets = ticketTypeRequest.getNoOfTickets();
      
      totalAmount += noOfTickets * this.#ticketPrices[ticketType];
      noOfSeats += noOfTickets * (ticketType !== 'INFANT' ? 1 : 0);
    }
    
    // Make payment and seat reservation requests
    const paymentResult = this.#makePaymentRequest(accountId, totalAmount);
    const reservationResult = this.#makeReservationRequest(accountId,noOfSeats);
    
    if (paymentResult.success && reservationResult.success) {
      return {
        success: true,
        amount: totalAmount,
        seats: noOfSeats,
        paymentRef: paymentResult.ref,
        reservationRef: reservationResult.ref
      };
    } else {
      throw new Error('Payment and/or seat reservation failed');
    }
  }
  
  #validatePurchaseRequest(ticketTypeRequests) {

    if (ticketTypeRequests && ticketTypeRequests.length == 0) {
      throw new InvalidPurchaseException(`No of tickets must be at least 1`);
    }

    // Check if any of the ticket type is invalid
    for (const ticketTypeRequest of ticketTypeRequests) {

      const ticketType = ticketTypeRequest.getTicketType();
      const noOfTickets = ticketTypeRequest.getNoOfTickets();
      
      if (noOfTickets < 1) {
        throw new InvalidPurchaseException(`No of ${ticketType} tickets must be at least 1`);
      }

      // Check if an adult ticket has been purchased
      const adultRequest = ticketTypeRequests.find(request => request.getTicketType() === 'ADULT');
      
      if (ticketType !== 'ADULT' && noOfTickets > 0 && !adultRequest) {
          throw new InvalidPurchaseException(`${ticketType} tickets cannot be purchased without purchasing an adult ticket`);
      }
    }
    
    // Check if total no of tickets exceed the maximum limit
    const totalNoOfTickets = ticketTypeRequests.reduce((total, request) => total + request.getNoOfTickets(), 0);
    if (totalNoOfTickets > this.#maxNoOfTickets) {
      throw new InvalidPurchaseException(`No of tickets cannot exceed ${this.#maxNoOfTickets}`);
    }
  }
  
  #makePaymentRequest(accountId, amount) {
    // Implementation of payment request using TicketPaymentService
    const ticketPaymentService = new TicketPaymentService();
    ticketPaymentService.makePayment(accountId, amount);

    return {
      success: true,
      ref: 'PAYMENT-REF-123456789'
    };
  }
  
  #makeReservationRequest(accountId, noOfSeats) {
    // Implementation of seat reservation request using SeatReservationService
    const seatReservationService = new SeatReservationService();
    seatReservationService.reserveSeat(accountId, noOfSeats);

    return {
      success: true,
      ref: 'RESERVATION-REF-123456789'
    };
  }
}
