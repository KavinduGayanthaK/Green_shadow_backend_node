export class VehicleModel {
  licensePlateNumber: string;
  category: string;
  fuelType: string;
  vehicleStatus: string;
  specialRemark: string;
  vehicleStaffMember: string;

  constructor(
    licensePlateNumber: string,
    category: string,
    fuelType: string,
    vehicleStatus: string,
    specialRemark: string,
    vehicleStaffMember: string
  ) {
    this.licensePlateNumber = licensePlateNumber;
    this.category = category;
    this.fuelType = fuelType;
    this.vehicleStatus = vehicleStatus;
    this.specialRemark = specialRemark;
    this.vehicleStaffMember = vehicleStaffMember;
  }
}
