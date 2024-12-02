import { Component } from '@angular/core';
import { SelectedHeader } from '../../../../../enums/selected-header.enum';
import { ContactService } from '../../../../../services/contact-service/contact.service';
import { AppUser, UserInfo } from '../../../../../intefaces/user.interface';
import { Contact, ContactRequest } from '../../../../../intefaces/contact.interface';
import { error } from 'console';

@Component({
  selector: 'app-account-contacts',
  templateUrl: './account-contacts.component.html',
  styleUrls: ['./account-contacts.component.scss']
})
export class AccountContactsComponent {
  public selectedHeader = SelectedHeader.myProfile;
  public user: AppUser = {} as AppUser;
  public userId: string = "";
  public contacts: Contact[] = [];
  public userContactRequests: ContactRequest[] = [];
  public receivedContactRequests: ContactRequest[] = [];
  public suggestedUsers: UserInfo[] = [];
  private token: string = '';

  constructor(private contactService: ContactService){
    this.getUser();
    this.getAllUserContact();
    this.getAllUserContactRequests();
    this.getReceivedContactRequests();
  }

  private getUser(): void {
    const token: string | null = localStorage.getItem('token');
    const storedUser: AppUser | null = this.contactService.getUser();
    if (!token || !storedUser) {
      alert("Attention, veuillez vous identifier pour accéder à cette page!");
      return;
    }
    this.token = token;
    this.user = storedUser;
    this.userId = this.user.id ?? "";
  }

  public sendContactRequest(receiverId: string): void {
    const relationType = 'friend';
    this.contactService.sendContactRequest(this.userId, receiverId, relationType, this.token).subscribe(
      (contactRequest: ContactRequest) => {
        alert(`Contact request sent successfully!', ${contactRequest.date}`);
        //TODO: mettre à jour l'interface utilisateur
      },
      (error) => {
        console.error('Error sending contact request:', error);
        alert('An error occurred while sending the contact request.');
      }
    );
  }

  public discoverNewContacts(): void {
    this.contactService.getContactSuggestions(this.userId, this.token).subscribe(
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
      this.contactService.removeContact(this.userId, contactId, this.token).subscribe(
        (success: boolean) => {
          if (success) {
            alert('Contact removed successfully!');
            this.contacts = this.contacts.filter(contact => contact.id !== contactId);
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
      this.contactService.cancelSentContactRequest(contactRequestId, this.token).subscribe(
        (success: boolean) => {
          if (success) {
            this.userContactRequests = this.userContactRequests.filter(request => request.id !== contactRequestId);
          }
        }
      );
    }
  }

  public acceptRequest(contactRequest: ContactRequest): void {
    this.contactService.acceptContactRequest( contactRequest, this.token).subscribe((newContact: Contact) => {
      alert('Contact request accepted!');
      this.contacts.push(newContact);
      this.receivedContactRequests = this.receivedContactRequests.filter(req => req.id !== contactRequest.id);
    });
  }

  public refuseRequest(contactRequest: ContactRequest): void {
    if (confirm('Are you sure you want to refuse this request?')) {
      this.contactService.refuseContactRequest(contactRequest, this.token).subscribe(
        (success: boolean) => {
          if (success) {
            this.receivedContactRequests = this.receivedContactRequests.filter(req => req.id !== contactRequest.id);
          }
        }
      );
    }
  }

  
  private getAllUserContact(): void {
    this.contactService.getUserContacts(this.userId, this.token).subscribe((contacts: Contact[]) => {
      this.contacts = contacts;
    });
  }

  private getAllUserContactRequests(): void {
    this.contactService.getAllUserContactRequests(this.userId, this.token).subscribe(
      (contactRequests: ContactRequest[]) => {
        this.userContactRequests = contactRequests;
      },
      (error: Error) => {
        this.userContactRequests = [];
      }
  
  );
  }

  private getReceivedContactRequests(): void {
    this.contactService.getReceivedContactRequests(this.userId, this.token).subscribe(
      
      (contactRequests: ContactRequest[]) => {
        this.receivedContactRequests = contactRequests;
      },
      (error: Error) => {
        this.receivedContactRequests = [];
      }
    
    );
  }
}
