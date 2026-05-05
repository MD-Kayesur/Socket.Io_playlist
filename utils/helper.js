export function validateOrder(data){
    if(!data.customerName?.trim()){
        return {isValid:false, message: "Customer name is required"}
    }
    if(!data.customerName?.trim()){
        return {isValid:false, message: "Courier name is required"}
    }
    if(!data.courierPhone?.trim()){
        return {isValid:false, message: "Courier Phone is required"}
    }
    if(!data.customerAddress?.trim()){
        return {isValid:false, message: "Pickup address is required"}
    }
    if(!data.deliveryAddress?.trim()){
        return {isValid:false, message: "Delivery address is required"}
    }
     if(!Array.isArray(data.items)){
        return {isValid:false, message: "Items is required"}
     }
     for(const item of data.items){

     }

    return {isValid:true, message:"Valid Order"}
}
//order id generator -> formate : ORD-1749216465721
export function generateOrderId(){
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2,"0")
    const day = String(now.getDate()).padStart(2,"0")
    const hour = String(now.getHours()).padStart(2,"0")
    const min = String(now.getMinutes()).padStart(2,"0")
    const second = String(now.getSeconds()).padStart(2,"0")
    const milliseconds = String(now.getMilliseconds()).padStart(3,"0")
    const random = Math.floor(1000+Math.random() * 9000)
    const dayHourMinuteSecond = 
}
