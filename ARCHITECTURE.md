# System Architecture

## C4 Model - System Context & Containers

```mermaid
graph TD
    %% USERS
    Customer((Prospective Customer))
    Admin((Site Admin))

    %% SYSTEM BOUNDARY
    subgraph "Mark Overseas Website (System)"
        
        %% CONTAINER: STATIC SITE
        subgraph "Static UI (Vercel CDN)"
            CorePages[Core Pages\n(index/about/contact)]
            CategoryPages[Category Pages\n(spices/beans/oil-seeds)]
            ProductPages[Product Pages\n(product-*.html)]
            SubProductPages[Sub-Product Pages\n(subproduct-*.html)]
            Assets[Static Assets\n(images/css/js)]
        end

        %% CONTAINER: API
        subgraph "Serverless Functions (Vercel)"
            SendEmailAPI["/api/send-email.js\n(Node.js)"]
        end

        %% CONTAINER: DATABASE (GOOGLE CLOUD)
        subgraph "Firebase Cloud"
            Firestore[Firestore Database]
            subgraph "Collections"
                ColInquiries[inquiries]
                ColSettings[settings]
            end
        end
    end

    %% EXTERNAL SYSTEMS
    Gmail[Gmail SMTP]
    GTranslate[Google Translate Widget]

    %% RELATIONS - CUSTOMER
    Customer -->|HTTPS GET| CorePages
    Customer -->|HTTPS GET| ProductPages
    Customer -->|Uses| GTranslate
    Customer -- "Submits Inquiry\n(HTTPS POST)" --> SendEmailAPI

    %% RELATIONS - ADMIN
    Admin -->|HTTPS GET| AdminPage[admin.html]
    Admin -- "Auth (Client-Side Gate)" --> ColSettings
    Admin -- "Reads/Deletes" --> ColInquiries

    %% RELATIONS - INTERNAL
    SendEmailAPI -- "SMTP Auth" --> Gmail
    SendEmailAPI -- "Backup Write" --> ColInquiries
    SendEmailAPI -- "Referer Check" --> CorePages

    %% DEPLOYMENT / BUILD
    subgraph "Build Pipeline"
        Dev[Developer]
        Repo[GitHub Repo]
        LocalScripts[Python Generators\n(generate-product-pages.py)]
        
        Dev -- "Commits" --> Repo
        LocalScripts -- "Generates" --> ProductPages
        LocalScripts -- "Generates" --> SubProductPages
        Repo -- "Deploys to" --> Vercel[Vercel Platform]
    end
```

## Description
The system follows a JAMstack architecture:
1.  **Frontend**: Pre-generated static HTML files (SSG) hosted on Vercel's Edge Network.
2.  **Backend**: Vercel Serverless Functions (Node.js) handling dynamic logic like email dispatch.
3.  **Data**: Firebase Firestore provides a NoSQL database for inquiry persistence and simple admin config.
4.  **Integrations**: 
    - **Gmail**: For reliable email delivery via Nodemailer.
    - **Google Translate**: For localization.

## Directory Structure Maps
- `api/`: Serverless functions.
- `product-*.html`: SEO-optimized product pages (generated).
- `product_data.json`: Source of truth for product content.
- `generate-product-pages.py`: Build script.
