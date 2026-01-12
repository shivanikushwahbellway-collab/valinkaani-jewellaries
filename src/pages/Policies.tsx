import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const formatDate = (date: Date) => {
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const currentDate = formatDate(new Date());

const Policies = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 pt-16 pb-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-serif tracking-tight">Store Policies</h1>
            <p className="mt-4 text-muted-foreground">Transparency you can trust. Please review our privacy, shipping, cancellation, refund and terms carefully.</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sticky TOC */}
          <aside className="lg:col-span-3">
            <Card className="p-0 overflow-hidden sticky top-24">
              <div className="bg-primary/5 px-5 py-4">
                <p className="text-sm text-muted-foreground">Last updated: {currentDate}</p>
              </div>
              <Separator />
              <nav className="p-4 space-y-2">
                <a href="#privacy" className="block text-sm text-foreground/80 hover:text-primary transition-colors">Privacy Policy</a>
                <a href="#shipping" className="block text-sm text-foreground/80 hover:text-primary transition-colors">Shipping & Delivery</a>
                <a href="#cancellation" className="block text-sm text-foreground/80 hover:text-primary transition-colors">Cancellation & Refund</a>
                <a href="#terms" className="block text-sm text-foreground/80 hover:text-primary transition-colors">Terms & Conditions</a>
              </nav>
            </Card>
          </aside>

          {/* Content */}
          <div className="lg:col-span-9 space-y-8">
            {/* Privacy Policy */}
            <Card id="privacy" className="p-6">
              <h2 className="text-2xl font-serif">Privacy Policy</h2>
              <div className="space-y-4 leading-relaxed mt-4">
                    <p>
                      This privacy policy ("Policy") relates to the manner Vailankanni jewellers in which we use, handle and process the data that you provide us in connection with using the products or services we offer. By using this website or by availing goods or services offered by us, you agree to the terms and conditions of this Policy, and consent to our use, storage, disclosure, and transfer of your information or data in the manner described in this Policy.
                    </p>
                    <p>
                      Vailankanni jewellers are committed to ensuring that your privacy is protected in accordance with applicable laws and regulations. We urge you to acquaint yourself with this Policy to familiarize yourself with the manner in which your data is being handled by us.
                    </p>
                    <p>
                      Vailankanni jewellers may change this Policy periodically and we urge you to check this page for the latest version of the Policy in order to keep yourself updated.
                    </p>
                    <h3 className="text-base font-semibold mt-6">What data is being collected</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Name</li>
                      <li>Contact information including address and email address</li>
                      <li>Demographic information, preferences or interests</li>
                      <li>Personal Data or other information relevant/required for providing the goods or services to you</li>
                      <li>The meaning of Personal Data will be as defined under relevant Indian laws</li>
                    </ul>
                    <p className="text-muted-foreground">
                      Note: Notwithstanding anything under this Policy—as required under applicable Indian laws, we will not be storing any credit card, debit card or any other similar card data of yours. Please also note that all data or information collected from you will be strictly in accordance with applicable laws and guidelines.
                    </p>
                    <h3 className="text-base font-semibold mt-6">What we do with the data we gather</h3>
                    <p>We require this data to provide you the goods or services offered by us including but not limited to the purposes below:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Internal record keeping</li>
                      <li>Improving our products or services</li>
                      <li>Providing updates regarding our products or services, including any special offers</li>
                      <li>Communicating information to you</li>
                      <li>Internal training and quality assurance purposes</li>
                    </ul>
                    <h3 className="text-base font-semibold mt-6">Who do we share your data with</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Third parties including our service providers for operational and business reasons</li>
                      <li>Our group companies (to the extent relevant)</li>
                      <li>Our auditors or advisors to the extent required by them</li>
                      <li>Governmental, regulatory or law enforcement authorities pursuant to legal obligations</li>
                    </ul>
                    <h3 className="text-base font-semibold mt-6">How we use cookies</h3>
                    <p>
                      We use cookies to collect information and to better understand customer behavior. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to avail our goods or services to the full extent. We do not control the use of cookies by third parties. The third party service providers have their own privacy policies addressing how they use such information.
                    </p>
                    <h3 className="text-base font-semibold mt-6">Your rights relating to your data</h3>
                    <p>
                      Right to Review - You can review the data provided by you and can request us to correct or amend such data (to the extent feasible, as determined by us). That said, we will not be responsible for the authenticity of the data or information provided by you.
                    </p>
                    <p>
                      Withdrawal of your Consent - You can choose not to provide your data at any time while availing our goods or services or otherwise withdraw your consent provided to us earlier, in writing to our email ID: vailankannijewellers89@gmail.com.
                    </p>
                    <p>
                      In the event you choose to not provide or later withdraw your consent, we may not be able to provide you our services or goods. Please note that these rights are subject to our compliance with applicable laws.
                    </p>
                    <h3 className="text-base font-semibold mt-6">How long will we retain your information or data for?</h3>
                    <p>
                      We may retain your information or data (i) for as long as we are providing goods and services to you; and (ii) as permitted under applicable law, we may also retain your data or information even after you terminate the business relationship with us. However, we will process such information or data in accordance with applicable laws and this Policy.
                    </p>
                    <h3 className="text-base font-semibold mt-6">Data Security</h3>
                    <p>
                      We will use commercially reasonable and legally required precautions to preserve the integrity and security of your information and data.
                    </p>
                    <h3 className="text-base font-semibold mt-6">Queries/ Grievance Officer</h3>
                    <p>
                      For any queries, questions or grievances around this Policy, please contact us using the contact information provided on this website.
                    </p>
              </div>
            </Card>

            {/* Shipping & Delivery Policy */}
            <Card id="shipping" className="p-6">
              <h2 className="text-2xl font-serif">Shipping & Delivery Policy</h2>
              <div className="space-y-4 leading-relaxed mt-4">
                <p>Last updated on {currentDate}.</p>
                <p>
                  For international buyers, orders are shipped and delivered through registered international courier companies and/or international speed post only. For domestic buyers, orders are shipped through registered domestic courier companies and/or speed post only.
                </p>
                <p>
                  Orders are shipped within 7 days or as per the delivery date agreed at the time of order confirmation, and the delivery of the shipment is subject to the courier company/post office norms. Vailankanni Jewellers is not liable for any delays in delivery by the courier company/postal authorities and only guarantees to hand over the consignment to the courier company or postal authorities within 7 days from the date of the order and payment, or as per the delivery date agreed at the time of order confirmation.
                </p>
                <p>
                  Delivery of all orders will be made to the address provided by the buyer. Delivery of our services will be confirmed to your email address as specified during registration. For any issues in utilizing our services, you may contact our helpdesk at  9545111124 or vailankannijewellers89@gmail.com.
                </p>
              </div>
            </Card>

            {/* Cancellation & Refund Policy */}
            <Card id="cancellation" className="p-6">
              <h2 className="text-2xl font-serif">Cancellation & Refund Policy</h2>
              <div className="space-y-4 leading-relaxed mt-4">
                <p>Last updated on {currentDate}.</p>
                <p>Vailankkani Jewellers believes in helping its customers as far as possible, and has therefore a liberal cancellation policy. Under this policy:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Cancellations will be considered only if the request is made immediately after placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.</li>
                  <li>Vailankanni Jewellers does not accept cancellation requests for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.</li>
                  <li>In case of receipt of damaged or defective items please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at his own end. This should be reported within 1 days of receipt of the products.</li>
                  <li>In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 1 days of receiving the product. The Customer Service Team after looking into your complaint will take an appropriate decision.</li>
                  <li>In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them.</li>
                </ul>
                <p>
                  In case of any Refunds approved by the Vailankanni Jewellers, it’ll take 3-4 days for the refund to be processed to the end customer.
                </p>
                <div className="mt-6">
                  <h4 className="font-semibold">Input Fields from User to Populate Details</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                    <li>
                      How long after the delivery of order can customer request for cancellation or refund? Options: Only same day, 2 days, 7 days, 15 days, 30 days, 30+ days, No cancellation/refunds provided
                    </li>
                    <li>
                      How long will it take to process the refund after cancellation/refund request? Options: 1-2 days, 3-5 days, 6-8 days, 9-15 days, 16-30 days
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Terms & Conditions */}
            <Card id="terms" className="p-6">
              <h2 className="text-2xl font-serif">Terms & Conditions</h2>
              <div className="space-y-4 leading-relaxed mt-4">
                <p>Last updated on {currentDate}.</p>
                <p>
                  These Terms and Conditions, along with privacy policy or other terms ("Terms") constitute a binding agreement by and between Vailankanni Jewellers  and relate to your use of our website, goods or services (collectively, "Services"). By using our website and availing the Services, you agree that you have read and accepted these Terms (including the Privacy Policy). We reserve the right to modify these Terms at any time. It is your responsibility to periodically review these Terms to stay informed of updates.
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Provide true, accurate and complete information during and after registration; you are responsible for all acts done through your registered account.</li>
                  <li>No warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of information and materials; we exclude liability to the fullest extent permitted by law.</li>
                  <li>Your use of our Services and website is at your own risk and discretion. Ensure the Services meet your requirements.</li>
                  <li>Contents of the Website and Services are proprietary to us; no rights are transferred to you.</li>
                  <li>Unauthorized use may lead to action per these Terms or applicable laws.</li>
                  <li>You agree to pay charges associated with availing the Services.</li>
                  <li>Do not use the website/Services for unlawful purposes or those forbidden by these Terms or applicable laws.</li>
                  <li>Third-party links may govern you by their own terms and privacy policies.</li>
                  <li>Initiating a transaction forms a legally binding contract with us for the Services.</li>
                  <li>Refunds are available if we are not able to provide the Service, per applicable timelines/policies. Missing the stipulated time renders you ineligible for a refund.</li>
                  <li>Force majeure: parties are not liable where performance is prevented or delayed by events beyond control.</li>
                  <li>Governing law: India. Jurisdiction: courts in India Goa </li>
                  <li>All concerns or communications relating to these Terms must be communicated using the contact information on this website.</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Policies;


