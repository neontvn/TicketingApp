import { Ticket } from "../ticket";

it('implements optimistic concurrency control', async (done) => {

    // Create an instance of ticket
    const ticket = await Ticket.build({
        title : "concert",
        price : 23,
        userId : "123"
    })
    
    // Save ticket to database
    await ticket.save();

    // fetch the ticket twice
    const firstInstance  = await Ticket.findById(ticket.id);
    const secondInstance  = await Ticket.findById(ticket.id);

    // make 2 separate changes to the tickets we faced
    firstInstance!.set({ price : 10 });
    secondInstance!.set({ price : 15 });

    // save the first fetched ticket
    await firstInstance!.save();

    // save the second fetched ticket and expect an error
    // VersionError: No matching document found for id "5fe99fb87848454bcd7ea770" version 0 modifiedPaths "price"
    try{
        await secondInstance!.save(); 
    }catch(err){
        return done();
    }

    throw new Error("Should not reach this line");

});

it('increments the version number on multiple saves', async ()=>{
    const ticket = await Ticket.build({
        title : "concert",
        price : 23,
        userId : "123"
    })

    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);

})