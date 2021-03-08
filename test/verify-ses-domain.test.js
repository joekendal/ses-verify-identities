"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("@aws-cdk/assert");
const cdk = require("@aws-cdk/core");
const lib_1 = require("../lib");
const domain = 'example.org';
const hostedZoneId = '12345';
const zoneName = domain + '.';
lib_1.VerifySesDomain.prototype.getHostedZone = jest.fn().mockReturnValue({
    HostedZoneId: hostedZoneId,
    zoneName: zoneName
});
describe('SES domain verification', () => {
    it('ensure custom resource exists to initiate domain verification', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'TestStack');
        new lib_1.VerifySesDomain(stack, 'VerifyExampleDomain', {
            domainName: domain,
            addTxtRecord: false,
            addMxRecord: false,
            addDkimRecords: false
        });
        assert_1.expect(stack).to(assert_1.countResources('Custom::AWS', 3));
        assert_1.expect(stack).to(assert_1.haveResourceLike('Custom::AWS', {
            Create: {
                service: 'SES',
                action: 'verifyDomainIdentity',
                parameters: {
                    Domain: domain
                }
            },
            Delete: {
                service: 'SES',
                action: 'deleteIdentity',
                parameters: {
                    Identity: domain
                }
            }
        }));
        assert_1.expect(stack).to(assert_1.countResources('AWS::SNS::Topic', 1));
        assert_1.expect(stack).to(assert_1.countResources('AWS::Route53::RecordSet', 0));
    });
    it('ensure txt record is added', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'TestStack');
        const domain = 'example.org';
        new lib_1.VerifySesDomain(stack, 'VerifyExampleDomain', {
            domainName: domain,
            addTxtRecord: true,
            addMxRecord: false,
            addDkimRecords: false
        });
        assert_1.expect(stack).to(assert_1.countResources('Custom::AWS', 3));
        assert_1.expect(stack).to(assert_1.countResources('AWS::SNS::Topic', 1));
        assert_1.expect(stack).to(assert_1.countResources('AWS::Route53::RecordSet', 1));
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::Route53::RecordSet', {
            Type: 'TXT',
            Name: '_amazonses.' + zoneName
        }));
    });
    it('ensure mx record is added', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'TestStack');
        const domain = 'example.org';
        new lib_1.VerifySesDomain(stack, 'VerifyExampleDomain', {
            domainName: domain,
            addTxtRecord: false,
            addMxRecord: true,
            addDkimRecords: false
        });
        assert_1.expect(stack).to(assert_1.countResources('Custom::AWS', 3));
        assert_1.expect(stack).to(assert_1.countResources('AWS::SNS::Topic', 1));
        assert_1.expect(stack).to(assert_1.countResources('AWS::Route53::RecordSet', 1));
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::Route53::RecordSet', {
            Type: 'MX',
            Name: zoneName
        }));
    });
    it('ensure dkim records are added', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'TestStack');
        const domain = 'example.org';
        new lib_1.VerifySesDomain(stack, 'VerifyExampleDomain', {
            domainName: domain,
            addTxtRecord: false,
            addMxRecord: false,
            addDkimRecords: true
        });
        assert_1.expect(stack).to(assert_1.countResources('Custom::AWS', 4));
        assert_1.expect(stack).to(assert_1.countResources('AWS::SNS::Topic', 1));
        assert_1.expect(stack).to(assert_1.countResources('AWS::Route53::RecordSet', 3));
        const c = assert_1.Capture.anyType();
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::Route53::RecordSet', {
            Type: 'CNAME',
            Name: {
                'Fn::Join': ['', c.capture()]
            }
        }));
        expect(c.capturedValue).toContain('._domainkey.' + zoneName);
    });
    it('ensure custom topic is used', () => {
        // TODO: write test
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVyaWZ5LXNlcy1kb21haW4udGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZlcmlmeS1zZXMtZG9tYWluLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBaUc7QUFDakcscUNBQXFDO0FBQ3JDLGdDQUF5QztBQUV6QyxNQUFNLE1BQU0sR0FBRyxhQUFhLENBQUM7QUFDN0IsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDO0FBQzdCLE1BQU0sUUFBUSxHQUFHLE1BQU0sR0FBRyxHQUFHLENBQUM7QUFDOUIscUJBQWUsQ0FBQyxTQUFTLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxlQUFlLENBQUM7SUFDbEUsWUFBWSxFQUFFLFlBQVk7SUFDMUIsUUFBUSxFQUFFLFFBQVE7Q0FDbkIsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRTtJQUN2QyxFQUFFLENBQUMsK0RBQStELEVBQUUsR0FBRyxFQUFFO1FBQ3ZFLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFOUMsSUFBSSxxQkFBZSxDQUFDLEtBQUssRUFBRSxxQkFBcUIsRUFBRTtZQUNoRCxVQUFVLEVBQUUsTUFBTTtZQUNsQixZQUFZLEVBQUUsS0FBSztZQUNuQixXQUFXLEVBQUUsS0FBSztZQUNsQixjQUFjLEVBQUUsS0FBSztTQUN0QixDQUFDLENBQUM7UUFFSCxlQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLHVCQUFjLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEQsZUFBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FDakIseUJBQWdCLENBQUMsYUFBYSxFQUFFO1lBQzlCLE1BQU0sRUFB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RixNQUFNLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEdBQUcsUUFBUSxDQUFDLENBQUM7SUFDL0QsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxFQUFFO1FBQ3JDLG1CQUFtQjtJQUNyQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2FwdHVyZSwgY291bnRSZXNvdXJjZXMsIGV4cGVjdCBhcyBleHBlY3RDREssIGhhdmVSZXNvdXJjZUxpa2UgfSBmcm9tICdAYXdzLWNkay9hc3NlcnQnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgVmVyaWZ5U2VzRG9tYWluIH0gZnJvbSAnLi4vbGliJztcblxuY29uc3QgZG9tYWluID0gJ2V4YW1wbGUub3JnJztcbmNvbnN0IGhvc3RlZFpvbmVJZCA9ICcxMjM0NSc7XG5jb25zdCB6b25lTmFtZSA9IGRvbWFpbiArICcuJztcblZlcmlmeVNlc0RvbWFpbi5wcm90b3R5cGUuZ2V0SG9zdGVkWm9uZSA9IGplc3QuZm4oKS5tb2NrUmV0dXJuVmFsdWUoe1xuICBIb3N0ZWRab25lSWQ6IGhvc3RlZFpvbmVJZCxcbiAgem9uZU5hbWU6IHpvbmVOYW1lXG59KTtcblxuZGVzY3JpYmUoJ1NFUyBkb21haW4gdmVyaWZpY2F0aW9uJywgKCkgPT4ge1xuICBpdCgnZW5zdXJlIGN1c3RvbSByZXNvdXJjZSBleGlzdHMgdG8gaW5pdGlhdGUgZG9tYWluIHZlcmlmaWNhdGlvbicsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdUZXN0U3RhY2snKTtcblxuICAgIG5ldyBWZXJpZnlTZXNEb21haW4oc3RhY2ssICdWZXJpZnlFeGFtcGxlRG9tYWluJywge1xuICAgICAgZG9tYWluTmFtZTogZG9tYWluLFxuICAgICAgYWRkVHh0UmVjb3JkOiBmYWxzZSxcbiAgICAgIGFkZE14UmVjb3JkOiBmYWxzZSxcbiAgICAgIGFkZERraW1SZWNvcmRzOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgZXhwZWN0Q0RLKHN0YWNrKS50byhjb3VudFJlc291cmNlcygnQ3VzdG9tOjpBV1MnLCAzKSk7XG4gICAgZXhwZWN0Q0RLKHN0YWNrKS50byhcbiAgICAgIGhhdmVSZXNvdXJjZUxpa2UoJ0N1c3RvbTo6QVdTJywge1xuICAgICAgICBDcmVhdGU6IHtcbiAgICAgICAgICBzZXJ2aWNlOiAnU0VTJyxcbiAgICAgICAgICBhY3Rpb246ICd2ZXJpZnlEb21haW5JZGVudGl0eScsXG4gICAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgICAgRG9tYWluOiBkb21haW5cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIERlbGV0ZToge1xuICAgICAgICAgIHNlcnZpY2U6ICdTRVMnLFxuICAgICAgICAgIGFjdGlvbjogJ2RlbGV0ZUlkZW50aXR5JyxcbiAgICAgICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICBJZGVudGl0eTogZG9tYWluXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG4gICAgZXhwZWN0Q0RLKHN0YWNrKS50byhjb3VudFJlc291cmNlcygnQVdTOjpTTlM6OlRvcGljJywgMSkpO1xuICAgIGV4cGVjdENESyhzdGFjaykudG8oY291bnRSZXNvdXJjZXMoJ0FXUzo6Um91dGU1Mzo6UmVjb3JkU2V0JywgMCkpO1xuICB9KTtcblxuICBpdCgnZW5zdXJlIHR4dCByZWNvcmQgaXMgYWRkZWQnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnVGVzdFN0YWNrJyk7XG4gICAgY29uc3QgZG9tYWluID0gJ2V4YW1wbGUub3JnJztcblxuICAgIG5ldyBWZXJpZnlTZXNEb21haW4oc3RhY2ssICdWZXJpZnlFeGFtcGxlRG9tYWluJywge1xuICAgICAgZG9tYWluTmFtZTogZG9tYWluLFxuICAgICAgYWRkVHh0UmVjb3JkOiB0cnVlLFxuICAgICAgYWRkTXhSZWNvcmQ6IGZhbHNlLFxuICAgICAgYWRkRGtpbVJlY29yZHM6IGZhbHNlXG4gICAgfSk7XG5cbiAgICBleHBlY3RDREsoc3RhY2spLnRvKGNvdW50UmVzb3VyY2VzKCdDdXN0b206OkFXUycsIDMpKTtcbiAgICBleHBlY3RDREsoc3RhY2spLnRvKGNvdW50UmVzb3VyY2VzKCdBV1M6OlNOUzo6VG9waWMnLCAxKSk7XG4gICAgZXhwZWN0Q0RLKHN0YWNrKS50byhjb3VudFJlc291cmNlcygnQVdTOjpSb3V0ZTUzOjpSZWNvcmRTZXQnLCAxKSk7XG4gICAgZXhwZWN0Q0RLKHN0YWNrKS50byhcbiAgICAgIGhhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6Um91dGU1Mzo6UmVjb3JkU2V0Jywge1xuICAgICAgICBUeXBlOiAnVFhUJyxcbiAgICAgICAgTmFtZTogJ19hbWF6b25zZXMuJyArIHpvbmVOYW1lXG4gICAgICB9KVxuICAgICk7XG4gIH0pO1xuXG4gIGl0KCdlbnN1cmUgbXggcmVjb3JkIGlzIGFkZGVkJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1Rlc3RTdGFjaycpO1xuICAgIGNvbnN0IGRvbWFpbiA9ICdleGFtcGxlLm9yZyc7XG5cbiAgICBuZXcgVmVyaWZ5U2VzRG9tYWluKHN0YWNrLCAnVmVyaWZ5RXhhbXBsZURvbWFpbicsIHtcbiAgICAgIGRvbWFpbk5hbWU6IGRvbWFpbixcbiAgICAgIGFkZFR4dFJlY29yZDogZmFsc2UsXG4gICAgICBhZGRNeFJlY29yZDogdHJ1ZSxcbiAgICAgIGFkZERraW1SZWNvcmRzOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgZXhwZWN0Q0RLKHN0YWNrKS50byhjb3VudFJlc291cmNlcygnQ3VzdG9tOjpBV1MnLCAzKSk7XG4gICAgZXhwZWN0Q0RLKHN0YWNrKS50byhjb3VudFJlc291cmNlcygnQVdTOjpTTlM6OlRvcGljJywgMSkpO1xuICAgIGV4cGVjdENESyhzdGFjaykudG8oY291bnRSZXNvdXJjZXMoJ0FXUzo6Um91dGU1Mzo6UmVjb3JkU2V0JywgMSkpO1xuICAgIGV4cGVjdENESyhzdGFjaykudG8oXG4gICAgICBoYXZlUmVzb3VyY2VMaWtlKCdBV1M6OlJvdXRlNTM6OlJlY29yZFNldCcsIHtcbiAgICAgICAgVHlwZTogJ01YJyxcbiAgICAgICAgTmFtZTogem9uZU5hbWVcbiAgICAgIH0pXG4gICAgKTtcbiAgfSk7XG5cbiAgaXQoJ2Vuc3VyZSBka2ltIHJlY29yZHMgYXJlIGFkZGVkJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1Rlc3RTdGFjaycpO1xuICAgIGNvbnN0IGRvbWFpbiA9ICdleGFtcGxlLm9yZyc7XG5cbiAgICBuZXcgVmVyaWZ5U2VzRG9tYWluKHN0YWNrLCAnVmVyaWZ5RXhhbXBsZURvbWFpbicsIHtcbiAgICAgIGRvbWFpbk5hbWU6IGRvbWFpbixcbiAgICAgIGFkZFR4dFJlY29yZDogZmFsc2UsXG4gICAgICBhZGRNeFJlY29yZDogZmFsc2UsXG4gICAgICBhZGREa2ltUmVjb3JkczogdHJ1ZVxuICAgIH0pO1xuXG4gICAgZXhwZWN0Q0RLKHN0YWNrKS50byhjb3VudFJlc291cmNlcygnQ3VzdG9tOjpBV1MnLCA0KSk7XG4gICAgZXhwZWN0Q0RLKHN0YWNrKS50byhjb3VudFJlc291cmNlcygnQVdTOjpTTlM6OlRvcGljJywgMSkpO1xuICAgIGV4cGVjdENESyhzdGFjaykudG8oY291bnRSZXNvdXJjZXMoJ0FXUzo6Um91dGU1Mzo6UmVjb3JkU2V0JywgMykpO1xuXG4gICAgY29uc3QgYyA9IENhcHR1cmUuYW55VHlwZSgpO1xuICAgIGV4cGVjdENESyhzdGFjaykudG8oXG4gICAgICBoYXZlUmVzb3VyY2VMaWtlKCdBV1M6OlJvdXRlNTM6OlJlY29yZFNldCcsIHtcbiAgICAgICAgVHlwZTogJ0NOQU1FJyxcbiAgICAgICAgTmFtZToge1xuICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgYy5jYXB0dXJlKCldXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcblxuICAgIGV4cGVjdChjLmNhcHR1cmVkVmFsdWUpLnRvQ29udGFpbignLl9kb21haW5rZXkuJyArIHpvbmVOYW1lKTtcbiAgfSk7XG5cbiAgaXQoJ2Vuc3VyZSBjdXN0b20gdG9waWMgaXMgdXNlZCcsICgpID0+IHtcbiAgICAvLyBUT0RPOiB3cml0ZSB0ZXN0XG4gIH0pO1xufSk7XG4iXX0=