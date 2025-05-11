import { Component, OnDestroy, OnInit } from '@angular/core';
import { SelectedHeader } from '../../../../../enums/selected-header.enum';
import { ContactService } from '../../../../../services/contact-service/contact.service';
import { AppUser, UserInfo } from '../../../../../intefaces/user.interface';
import { Contact, ContactRequest } from '../../../../../intefaces/contact.interface';
import { AuthenticationService } from '../../../../../services/auth/authentication.service';
import { Subject, takeUntil } from 'rxjs';
import { AccountContactsTabs } from '../../../../../enums/tabs.enum';
import { DialogService } from '../../../../../services/dialog-service/dialog.service';

@Component({
  selector: 'app-account-contacts',
  templateUrl: './account-contacts.component.html',
  styleUrls: ['./account-contacts.component.scss'],
})
export class AccountContactsComponent implements OnInit, OnDestroy {
  public selectedHeader = SelectedHeader.myProfile;
  public user: AppUser = {} as AppUser;
  public contacts: Contact[] = [];
  public userContactRequests: ContactRequest[] = [];
  public receivedContactRequests: ContactRequest[] = [];
  public suggestedUsers: UserInfo[] = [];
  public activeTab: AccountContactsTabs = AccountContactsTabs.Received;
  public accountContactsTabs = AccountContactsTabs;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private contactService: ContactService,
    private authService: AuthenticationService,
    private dialogService: DialogService
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
    this.contactService.sendContactRequest(this.user.id, receiverId, relationType).subscribe({
      next: (contactRequest: ContactRequest) => {
        this.dialogService.showSuccess(
          `Contact request sent successfully! Date: ${contactRequest.date}`,
          'Request Sent',
          'OK',
          true
        );
      },
      error: (error) => {
        console.error('Error sending contact request:', error);
        this.dialogService.showError(
          'An error occurred while sending the contact request.',
          'Request Failed'
        );
      },
    });
  }

  public discoverNewContacts(): void {
    this.contactService.getContactSuggestions(this.user.id).subscribe({
      next: (suggestedUsers: UserInfo[]) => {
        this.suggestedUsers = suggestedUsers;
        if (suggestedUsers.length === 0) {
          this.dialogService.showInfo(
            'No contact suggestions available at the moment.',
            'Contact Suggestions'
          );
        }
      },
      error: (error) => {
        console.error('Error fetching suggested users:', error);
        this.dialogService.showError(
          'An error occurred while fetching new contact suggestions.',
          'Suggestions Failed'
        );
      },
    });
  }

  public removeContact(contactId: string): void {
    this.dialogService
      .showConfirmation(
        'Are you sure you want to remove this contact?',
        'Remove Contact',
        'Remove',
        'Cancel'
      )
      .subscribe((confirmed) => {
        if (confirmed) {
          this.contactService.removeContact(this.user.id, contactId).subscribe({
            next: (success: boolean) => {
              if (success) {
                this.dialogService.showSuccess(
                  'Contact removed successfully!',
                  'Contact Removed',
                  'OK',
                  true
                );
                this.contacts = this.contacts.filter((contact) => contact.id !== contactId);
              } else {
                this.dialogService.showWarning('Failed to remove the contact.', 'Removal Failed');
              }
            },
            error: (error) => {
              console.error('Error removing contact:', error);
              this.dialogService.showError(
                'An error occurred while trying to remove the contact.',
                'Error'
              );
            },
          });
        }
      });
  }

  public cancelRequest(contactRequestId: string): void {
    this.dialogService
      .showConfirmation(
        'Are you sure you want to cancel this request?',
        'Cancel Request',
        'Yes, Cancel',
        'No, Keep Request'
      )
      .subscribe((confirmed) => {
        if (confirmed) {
          this.contactService.cancelSentContactRequest(contactRequestId).subscribe({
            next: (success: boolean) => {
              if (success) {
                this.userContactRequests = this.userContactRequests.filter(
                  (request) => request.id !== contactRequestId
                );
                this.dialogService.showSuccess(
                  'Request cancelled successfully.',
                  'Request Cancelled',
                  'OK',
                  true
                );
              } else {
                this.dialogService.showWarning(
                  'Failed to cancel the request.',
                  'Cancellation Failed'
                );
              }
            },
            error: (error) => {
              console.error('Error cancelling contact request:', error);
              this.dialogService.showError(
                'An error occurred while cancelling the request.',
                'Error'
              );
            },
          });
        }
      });
  }

  public acceptRequest(contactRequest: ContactRequest): void {
    this.contactService.acceptContactRequest(contactRequest).subscribe({
      next: (newContact: Contact) => {
        this.dialogService.showSuccess('Contact request accepted!', 'Request Accepted', 'OK', true);
        this.contacts.push(newContact);
        this.receivedContactRequests = this.receivedContactRequests.filter(
          (req) => req.id !== contactRequest.id
        );
      },
      error: (error) => {
        console.error('Error accepting contact request:', error);
        this.dialogService.showError('An error occurred while accepting the request.', 'Error');
      },
    });
  }

  public refuseRequest(contactRequest: ContactRequest): void {
    this.dialogService
      .showConfirmation(
        'Are you sure you want to refuse this request?',
        'Refuse Request',
        'Yes, Refuse',
        'No, Keep Request'
      )
      .subscribe((confirmed) => {
        if (confirmed) {
          this.contactService.refuseContactRequest(contactRequest).subscribe({
            next: (success: boolean) => {
              if (success) {
                this.receivedContactRequests = this.receivedContactRequests.filter(
                  (req) => req.id !== contactRequest.id
                );
                this.dialogService.showSuccess(
                  'Contact request refused.',
                  'Request Refused',
                  'OK',
                  true
                );
              } else {
                this.dialogService.showWarning('Failed to refuse the contact request.', 'Error');
              }
            },
            error: (error) => {
              console.error('Error refusing contact request:', error);
              this.dialogService.showError(
                'An error occurred while refusing the contact request.',
                'Error'
              );
            },
          });
        }
      });
  }

  private getAllUserContact(): void {
    this.contactService.getUserContacts(this.user.id).subscribe({
      next: (contacts: Contact[]) => {
        this.contacts = contacts;
      },
      error: (error) => {
        console.error('Error fetching contacts:', error);
        this.dialogService.showError(
          'Failed to load your contacts. Please try again later.',
          'Loading Error'
        );
      },
    });
  }

  private getAllUserContactRequests(): void {
    this.contactService.getAllUserContactRequests(this.user.id).subscribe({
      next: (contactRequests: ContactRequest[]) => {
        this.userContactRequests = contactRequests;
      },
      error: (error) => {
        console.error('Error fetching contact requests:', error);
        this.userContactRequests = [];
        this.dialogService.showError(
          'Failed to load your sent contact requests. Please try again later.',
          'Loading Error'
        );
      },
    });
  }

  private getReceivedContactRequests(): void {
    this.contactService.getReceivedContactRequests(this.user.id).subscribe({
      next: (contactRequests: ContactRequest[]) => {
        this.receivedContactRequests = contactRequests;
      },
      error: (error) => {
        console.error('Error fetching received contact requests:', error);
        this.receivedContactRequests = [];
        this.dialogService.showError(
          'Failed to load your received contact requests. Please try again later.',
          'Loading Error'
        );
      },
    });
  }

  private initializeData(): void {
    this.authService.loggedUser$.pipe(takeUntil(this.unsubscribe$)).subscribe((user) => {
      if (!user.id) {
        this.dialogService
          .showWarning('You need to be logged in to access this page.', 'Authentication Required')
          .subscribe(() => {
            this.authService.handleUnAuthorizedUser();
          });
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
