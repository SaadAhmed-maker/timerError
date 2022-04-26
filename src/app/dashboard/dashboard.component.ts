import { Component, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ApiService } from '../services/api.service';
import {AfterViewInit,ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['productName', 'category','date','freshness', 'price', 'comment', 'action'];
    dataSource!: MatTableDataSource<any>;
    
    idleState = 'Not started.';
    timedOut = false;
    lastPing?: Date = null as any;
    title = 'angular-idle-timeout';

  constructor(private dialog : MatDialog, private api : ApiService,
    private idle: Idle, private keepalive: Keepalive ,private router:Router) {
      
      idle.setIdle(5);
      idle.setTimeout(5);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => { 
      this.idleState = 'No longer idle.'
      console.log(this.idleState);
      this.reset();
    });


    idle.onTimeout.subscribe(() => {
      

      this.api.postProduct(this.idle.onIdleEnd)
      // 
      // .subscribe({
      //   next:(res)=>{
      //     alert("Product added successfully");
      //     this.productForm.reset();
      //     this.dialogRef.close('save');
      //   },
      //   error:()=>{
      //     alert("Error while adding the product")
      //   }
      // })


      this.idleState = 'Timed out!';
      this.timedOut = true;
      console.log(this.idleState);

      this.router.navigate(['']);
    });
    
    idle.onIdleStart.subscribe(() => {
        this.idleState = 'You\'ve gone idle!'
        console.log(this.idleState);
        
    });
    
    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!'
      console.log(this.idleState);
    });

    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.reset();

     }
    

 
      ngOnInit(): void{
        this.getAllProducts();
      
      }
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
      
  
    openDialog() {
      this.dialog.open(DialogComponent, {       
         width:'30%'
      }).afterClosed().subscribe(val=>{
        if(val ==='save'){
          this.getAllProducts();
        }
      })
    }
  
    getAllProducts(){
      this.api.getProduct()
      .subscribe({
        next:(res)=>{
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
  
        error:(err)=>{
          alert("Error while fetching the Records!!")
        }
      })
  
    }
  
      editProduct(row:any){
        this.dialog.open(DialogComponent,{
          width:'30%',
          data:row
        }).afterClosed().subscribe(val=>{
          if(val==='update'){
            this.getAllProducts();
          }
        })
      }
  
      deleteProduct(id:number){
        this.api.deleteProduct(id)
        .subscribe({
          next:(res)=>{
            alert("Product Deleted Successfully");
            this.getAllProducts();
          },
          error:()=>{
            alert("Error while deleting the product!!")
          }
        })
      }
  
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

    reset() {
      this.idle.watch();
      this.idleState = 'Started.';
      this.timedOut = false;
    }
  }
  
  


