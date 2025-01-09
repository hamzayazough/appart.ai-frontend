import { Component, OnDestroy, OnInit } from '@angular/core';
import { SelectedHeader } from '../../../../../enums/selected-header.enum';
import { ContactService } from '../../../../../services/contact-service/contact.service';
import { AppUser, UserInfo } from '../../../../../intefaces/user.interface';
import { Contact, ContactRequest } from '../../../../../intefaces/contact.interface';
import { AuthenticationService } from '../../../../../services/auth/authentication.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-account-contacts',
  templateUrl: './account-contacts.component.html',
  styleUrls: ['./account-contacts.component.scss']
})
export class AccountContactsComponent implements OnInit, OnDestroy {
  public selectedHeader = SelectedHeader.myProfile;
  public user: AppUser = {} as AppUser;
  public contacts: Contact[] = [];
  public userContactRequests: ContactRequest[] = [];
  public receivedContactRequests: ContactRequest[] = [];
  public suggestedUsers: UserInfo[] = [];
  private unsubscribe$ = new Subject<void>();


  constructor(
    private contactService: ContactService,
    private authService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  public sendContactRequest(receiverId: string): void {
    const relationType = 'friend';
    this.contactService.sendContactRequest(this.user.id, receiverId, relationType ).subscribe(
      (contactRequest: ContactRequest) => {
        alert(`Contact request sent successfully! Date: ${contactRequest.date}`);
      },
      (error) => {
        console.error('Error sending contact request:', error);
        alert('An error occurred while sending the contact request.');
      }
    );
  }

  public discoverNewContacts(): void {
    this.contactService.getContactSuggestions(this.user.id).subscribe(
      (suggestedUsers: UserInfo[]) => {
        this.suggestedUsers = suggestedUsers;
      },
      (error) => {
        console.error('Error fetching suggested users:', error);
        alert('An error occurred while fetching new contact suggestions.');
      }
    );
  }

  public removeContact(contactId: string): void {
    if (confirm('Are you sure you want to remove this contact?')) {
      this.contactService.removeContact(this.user.id, contactId).subscribe(
        (success: boolean) => {
          if (success) {
            alert('Contact removed successfully!');
            this.contacts = this.contacts.filter((contact) => contact.id !== contactId);
          } else {
            alert('Failed to remove the contact.');
          }
        },
        (error) => {
          console.error('Error removing contact:', error);
          alert('An error occurred while trying to remove the contact.');
        }
      );
    }
  }

  public cancelRequest(contactRequestId: string): void {
    if (confirm('Are you sure you want to cancel this request?')) {
      this.contactService.cancelSentContactRequest(contactRequestId).subscribe(
        (success: boolean) => {
          if (success) {
            this.userContactRequests = this.userContactRequests.filter(
              (request) => request.id !== contactRequestId
            );
          }
        },
        (error) => {
          console.error('Error cancelling contact request:', error);
        }
      );
    }
  }

  public acceptRequest(contactRequest: ContactRequest): void {
    this.contactService.acceptContactRequest(contactRequest).subscribe(
      (newContact: Contact) => {
        alert('Contact request accepted!');
        this.contacts.push(newContact);
        this.receivedContactRequests = this.receivedContactRequests.filter(
          (req) => req.id !== contactRequest.id
        );
      },
      (error) => {
        console.error('Error accepting contact request:', error);
      }
    );
  }

  public refuseRequest(contactRequest: ContactRequest): void {
    if (confirm('Are you sure you want to refuse this request?')) {
      this.contactService.refuseContactRequest(contactRequest).subscribe(
        (success: boolean) => {
          if (success) {
            this.receivedContactRequests = this.receivedContactRequests.filter(
              (req) => req.id !== contactRequest.id
            );
          }
        },
        (error) => {
          console.error('Error refusing contact request:', error);
        }
      );
    }
  }

  private getAllUserContact(): void {
    this.contactService.getUserContacts(this.user.id).subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
      },
      (error) => {
        console.error('Error fetching contacts:', error);
      }
    );
  }

  private getAllUserContactRequests(): void {
    this.contactService.getAllUserContactRequests(this.user.id).subscribe(
      (contactRequests: ContactRequest[]) => {
        this.userContactRequests = contactRequests;
      },
      (error) => {
        console.error('Error fetching contact requests:', error);
        this.userContactRequests = [];
      }
    );
  }

  private getReceivedContactRequests(): void {
    this.contactService.getReceivedContactRequests(this.user.id).subscribe(
      (contactRequests: ContactRequest[]) => {
        this.receivedContactRequests = contactRequests;
      },
      (error) => {
        console.error('Error fetching received contact requests:', error);
        this.receivedContactRequests = [];
      }
    );
  }

  private initializeData(): void {
    this.authService.loggedUser$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((user) => {
      if (!user.id) {
        this.authService.handleUnAuthorizedUser();
      } else {
        this.user = user;
        this.loadAllContacts();
      }
    });
  }

  private loadAllContacts(): void {
    this.getAllUserContact();
    this.getAllUserContactRequests();
    this.getReceivedContactRequests();
  }
}