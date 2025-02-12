export class EquipmentModel{
    equipmentId:string;
    equipmentName:string;
    equipmentType:string;
    totalCount:number;
    status:string;
    equipmentFields:string[];
    equipmentStaffMembers:string[];

    constructor(equipmentId:string,equipmentName:string,equipmentType:string,totalCount:number,status:string,
        equipmentFields:string[],equipmentStaffMembers:string[]) {

        this.equipmentId = equipmentId;
        this.equipmentName = equipmentName;
        this.equipmentType = equipmentType;
        this.totalCount = totalCount;
        this.status = status;
        this.equipmentFields = equipmentFields;
        this.equipmentStaffMembers = equipmentStaffMembers;
    }
}