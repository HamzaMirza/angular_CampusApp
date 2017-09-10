import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { GetstudentlistService } from '../getstudentlist.service';
import { educations } from '../educationList';
import {Router} from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import {FirebaseListObservable } from 'angularfire2/database';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
constructor(private router:Router,public authService: AuthService,public studentlistService:GetstudentlistService,private af:AngularFireDatabase) { 

}
 details={uid:"",name:"", address:"",cellNum:"",key:""};
 display:boolean=false; 
 displayStudentList:boolean=false; 
 displayVacancy:boolean=false; 
 isformSubmitted:boolean=false;
 isCorrect:boolean=false;
 educations=educations;
 date:string=new DatePipe('en-US').transform(new Date(), 'dd/MM/yyyy');
  posts:Object[]=[];
isViewJob:boolean=false;

  
  ngOnInit() 
  {
    if(this.authService.userName=="")
    {
       this.af.list('/users', { preserveSnapshot: true}).subscribe(snapshots=>
          {
            snapshots.forEach(snapshot => 
            {
                if(snapshot.val().uid==this.authService.uid)
                {
                  this.authService.userName=snapshot.val().userName;
                }
            });
          });
          
    }
       this.af.list('/usersDetails', { preserveSnapshot: true}).subscribe(snapshots=>
          {
            snapshots.forEach(snapshot => 
            {
                if(snapshot.val().uid==this.authService.uid)
                {
                  
                   this.details= snapshot.val();
                   this.details.key=snapshot.key;
                }
            });
          });
       this.af.list('/vacancies', { preserveSnapshot: true}).subscribe(snapshots=>
          {
            snapshots.forEach(snapshot => 
            {
                if(snapshot.val().owner==this.details.name)
                {
                   this.posts.push(snapshot.val());
                }
            });
          })
      
  }
  updateTodo2(data): void
  {
    this.af.object('/usersDetails/' + this.details.key)
    .update({name:data.name, address:data.address,cellNum:data.cellNum,key:this.details.key}).then(
      success=>this.isCorrect=true,
      error=>this.isCorrect=false
    ); 
    console.log(data.name,data.address,data.cellNum,this.details.key,"updted");   
 }
  uploadVacancy(data): void {
  this.af.list('/vacancies').push({ owner: this.details.name,date: this.date, subject: data.subject,details:data.detailVacancy,minQualification:data.education}).then(
      success=>this.isCorrect=true,
      error=>this.isCorrect=false
    ); 
}

  setDisplay()
  {
    this.displayStudentList=false; 
    this.displayVacancy=false; 
    this.isViewJob=false;
    this.display=true;
  }
  setDisplayStudentList()
  {
    this.display=false;
    this.displayVacancy=false;    
    this.isViewJob=false;
    this.displayStudentList=true;
  }
  setDisplayVacancy()
  {
    this.display=false;
    this.displayStudentList=false;
    this.isViewJob=false;
    this.displayVacancy=true; 
    
  }
  setDisplayLog()
  {
    this.display=false;
    this.displayStudentList=false;
    this.isViewJob=true;
    this.displayVacancy=false; 
    
  }
  onSubmit(data)
  {
    this.isCorrect=false;
    this.updateTodo2(data);
    this.isformSubmitted=true;
  }
  onSubmitVacancy(data)
  {
    this.isCorrect=false;
   this.uploadVacancy(data);
   this.isformSubmitted=true;
    this.displayVacancy=false;
   
  }
  changeFlag()
  {
    this.isformSubmitted=!this.isformSubmitted;
  }
 logout() 
  {
    this.authService.logout().then(
      success => this.router.navigate(['/login'])
    );
  }
  //vacany form
  // owner:companyName 
  // Data 
  // subject
  // Text
  // Minimum Qualification

}