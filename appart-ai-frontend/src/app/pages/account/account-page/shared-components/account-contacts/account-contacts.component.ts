import { Component, OnInit } from '@angular/core';
import { SelectedHeader } from '../../../../../enums/selected-header.enum';
import { ContactService } from '../../../../../services/contact-service/contact.service';
import { AppUser, UserInfo } from '../../../../../intefaces/user.interface';
import { Contact, ContactRequest } from '../../../../../intefaces/contact.interface';
import { TokenService } from '../../../../../services/token-service/token.service';
import { UserService } from '../../../../../services/user-service/user.service';
import { AuthenticationService } from '../../../../../services/auth/authentication.service';

@Component({
  selector: 'app-account-contacts',
  templateUrl: './account-contacts.component.html',
  styleUrls: ['./account-contacts.component.scss']
})
export class AccountContactsComponent implements OnInit {
  public selectedHeader = SelectedHeader.myProfile;
  public user: AppUser = {} as AppUser;
  public userId: string = '';
  public contacts: Contact[] = [];
  public userContactRequests: ContactRequest[] = [];
  public receivedContactRequests: ContactRequest[] = [];
  public suggestedUsers: UserInfo[] = [];

  constructor(
    private contactService: ContactService,
    private authService: AuthenticationService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.initializeData();
  }

  private async initializeData(): Promise<void> {
    try {
      this.authService.loggedUser.subscribe((user) => {
        this.user = user;
        this.userId = user.id || '';
        if(!this.userId){
          alert('You must be logged in to access your contacts');
          return;
        }
      });

      this.loadAllContacts();
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  }

  private loadAllContacts(): void {
    this.getAllUserContact();
    this.getAllUserContactRequests();
    this.getReceivedContactRequests();
  }

  public sendContactRequest(receiverId: string): void {
    const relationType = 'friend';
    this.contactService.sendContactRequest(this.userId, receiverId, relationType ).subscribe(
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
    this.contactService.getContactSuggestions(this.userId).subscribe(
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
      this.contactService.removeContact(this.userId, contactId).subscribe(
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
    this.contactService.getUserContacts(this.userId).subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
      },
      (error) => {
        console.error('Error fetching contacts:', error);
      }
    );
  }

  private getAllUserContactRequests(): void {
    this.contactService.getAllUserContactRequests(this.userId).subscribe(
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
    this.contactService.getReceivedContactRequests(this.userId).subscribe(
      (contactRequests: ContactRequest[]) => {
        this.receivedContactRequests = contactRequests;
      },
      (error) => {
        console.error('Error fetching received contact requests:', error);
        this.receivedContactRequests = [];
      }
    );
  }
}