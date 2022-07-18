# Cab-Booking

Description:

Implement a cab booking application. Below are the expected features from the system.

Features:
The application allows users to book rides on a route.
Users can register themself and make changes to their details.
Driving partner can onboard on the system with the vehicle details
Users can search and select one from multiple available rides on a route with the same source and destination based on the nearest to the user
Requirements:
Application should allow user onboarding.
add_user(user_detail)
Add basic user details
update_user(username, updated_details)
User should be able to update its contact details
update_userLocation(username,Location):
This will update the user location in X , Y coordinate to find nearest in future
Application should allow Driver onboarding
add_driver(driver_details,vehicle_details,current_location)
This will create an instance of the driver and will mark his current location on the map
update_driverLocation(driver_name)
This will mark the current location of driver 
change_driver_status(driver_name,status)
In this driver can make himself either available or unavailable via a boolean
      
Application should allow the user to find a ride based on the criteria below
find_ride (Username,Source , destination)
It will return a list of available ride 
choose_ride(Username,drive_name)
It will choose the drive name from the list
	Note : Only the driver which is at a max distance of 5 unit will be displayed to a user and 
		the driver should be in available state to confirm the booking
calculateBill(Username):
It will return the bill based on the distance between the source and destination and will display it    
Application should at the end calculate the earning of all the driver onboarded in the      application find_total_earning()
Other Notes:
Write a driver class for demo purposes. Which will execute all the commands at one place in the code and have test cases.
Do not use any database or NoSQL store, use in-memory data-structure for now. 
Do not create any UI for the application.
Please prioritize code compilation, execution and completion. 
Work on the expected output first and then add bonus features of your own.
Expectations:
Make sure that you have a working and demo-able code.
Make sure that code is functionally correct.
Use of proper abstraction, entity modelling, separation of concerns is good to have.
Code should be modular, readable and unit-testable.
Code should easily accommodate new requirements with minimal changes.
Proper exception handling is required.
Concurrency Handling (BONUS) [Good if you do this]

Sample Test Cases:
Onboard 3 users
add_user(“Abhishek, M, 23”); update_userLocation(“Abhishek”,(0,0)) 
add_user(“Rahul , M, 29”); update_userLocation(“Rahul”,(10,0))
add_user(“Nandini, F, 22”) ;update_userLocation(“Nandini”,(15,6))

Onboard 3 driver to the application
add_driver(“Driver1, M, 22”,“Swift, KA-01-12345”,(10,1))
add_driver(“Driver2, M, 29”,“Swift, KA-01-12345”,(11,10))
add_driver(“Driver3, M, 24”,“Swift, KA-01-12345”,(5,3))
	
User trying to get a ride 
find_ride(“Abhishek” ,(0,0),(20,1))
		Output : No ride found [Since all the driver are more than 5 units away from user]
find_ride(“Rahul” ,(10,0),(15,3))
		Output : Driver1 [Available]
		choose_ride(“Rahul”,”Driver1”)
		Output : ride Started
		calculateBill(“Rahul”)
		Output : ride Ended bill amount $ 6
		Backend API Call:	update_userLocation(“Rahul”,(15,3))
					update_driverLocation(“Driver1”,(15,3))
change_driver_status(“Driver1”,False)
find_ride(“Nandini”,(15,6),(20,4))
Output : No ride found [Driver one in set to not available]
Total earning by drivers
find_total_earning()
Driver1 earn $6
Driver2 earn $0
Driver3 earn $0




#  API INFORMATION

1.  router.post("/register/user",userController.registerUser );
    => API to register new user 
    => Take input in body in JSON form 
    => Input Example : {
                    "name": "Radhika Pathak",
                    "userName": "radhika123",
                    "email": "rdhika@gmail.com",
                    "password": "radhika123",
                    "location": {
                    "latitude": "101",
                    "longitude": "103"
                    }
                }

2.  router.post("/update/user",userController.updateUser );
    => To update user details by name , password , email
    => Take useName and a field to update 
    => In case of password changing , take cureent password and new password input
    => Input example : {
                    "userName" : "radhika123",               // mandatory 
                    "currentPassword" : "radhika123",        // optional
                    "newPassword": "radhika1234"             // optional
                    "name" : "Radhika"                       // optional
                } 

3.  router.post("/user/updatelocation",userController.updateUserLocation );
    => To update user's location 
    => Take userName and new location as input
    => Input Example : {
                    "userName" : "radhika123",
                    "location": {
                        "latitude": "43",
                        "longitude": "3"
                    }
                }

4.  router.post("/register/driver", driverController.registerDriver);
    => API to register new driver
    => Input Example : {
                    "name": "driver1",
                    "vehicle" : "scorpio",
                    "driverUniqueName": "driver1",
                    "email": "driver1@gmail.com",
                    "password": "driver1",
                    "location": {
                        "latitude": "890",
                        "longitude": "337"
                    }
                }


5.  router.post("/driver/updatelocation", driverController.updateDriverLocation);
    => To update driver's location
    => Input Example : {
                        "driverUniqueName" : "driver3",
                        "location": {
                            "latitude": "45",
                            "longitude": "103"
                        }
                    }


6.  router.post("/driver/updatestatus", driverController.updateDriverStatus);
    => To update driver's status as free/booked
    => Input Example : {
                            "driverUniqueName": "radhika123",
                            "status": "free"
                        }

7.  router.get("/findallavailabledrivers", bookingController.findAvailableDrivers);
    => API to find drivers who is 5 or less unit away from user's source location
    => Input Example : {
                            "userName" : "parul",
                            "source" : {
                                "sLatitude": "89",
                                "sLongitude": "789"
                            },
                            "destination": {
                                "dLatitude": "89",
                                "dLongitude": "789"
                            }
                        }

8.  router.post("/chooseride", bookingController.chooseRide);
    => API to choose driver from given data
    => Input Example : {
                            "userName" : "parul",
                            "driverUniqueName" : "driver1"
                        }

9.  router.post("/calculatebill", bookingController.calculateBill);
    => API to calculate total bill of ride
    => Input Example : {
                            "userName" : "parul",
                            "driverName": "driver1",
                            "source" : {
                                "sLatitude": "890",
                                "sLongitude": "337"
                            },
                            "destination": {
                                "dLatitude": "89",
                                "dLongitude": "789"
                            }
                        }

10. router.get("/totalearning", earning.calculateTotalEarningByDrivers);
    => API to find total earninf of all drivers
