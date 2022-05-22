import O3h from "../../core/api/o3h";
import O3hAPI from "../../core/api/o3h-api";

export default class O3hAPIExt extends O3hAPI {
    
    constructor(o3h, devServer = false) {
        
        super(o3h, devServer);

        O3h._instance = this;
    }

}