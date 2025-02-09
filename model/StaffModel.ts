export class StaffModel {
    staffId:string;
    firstName:string;
    lastName:string;
    designation:string
    gender:string;
    joinedDate:string | null;
    dateOfBirth:string | null;
    buildingNumber:string;
    lane:string;
    city:string;
    state:string;
    postalCode:string;
    contactNumber:string;
    email:string;
    role:string;
    fields:string[];
    vehicles:string[];
    equipments:string[];
    logs:string[];

    constructor(id:string,firstName:string,lastName:string,designation:string,gender:string,joinedDate:string | null,dateOfBirth:string | null,buildingNumber:string,lane:string,city:string,
        state:string,postalCode:string,contactNumber:string,email:string,role:string,fields:string[],vehicles:string[],equipments:string[],logs:string[]) {
        this.staffId = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.designation = designation;
        this.gender = gender;
        this.joinedDate = joinedDate;
        this.dateOfBirth = dateOfBirth;
        this.buildingNumber = buildingNumber;
        this.lane = lane;
        this.city = city;
        this.state = state;
        this.postalCode = postalCode;
        this.contactNumber = contactNumber;
        this.email = email;
        this.role = role;
        this.fields = fields;
        this.vehicles = vehicles;
        this.equipments = equipments;
        this.logs = logs;
    }
}