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