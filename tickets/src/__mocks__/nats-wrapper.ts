export const natsWrapper = {
    client: {
        // Custom implementation
        // publish:(subject:string, data:string, callback:()=> void)=>{
        //     callback();
        // }

        // Mock function
        publish: jest.fn().mockImplementation(
            (subject: string, data: string, callback: () => void) => {
                callback();
            })
    }
}