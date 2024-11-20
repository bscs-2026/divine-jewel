// Helper function to generate the batch ID
export function generateBatchID() {
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(100000 + Math.random() * 900000).toString();
    return `B-${timestamp}${randomNum}`;
}
