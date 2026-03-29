import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, Slide } from '../../../core/services/api.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
    selector: 'app-slide-manager',
    imports: [RouterLink, FormsModule, SpinnerComponent],
    template: `
    <div class="slides-page">
      <div class="slides-container">
        <div class="slides-header">
          <div>
            <h1 class="slides-title">Carousel Slides</h1>
            <p class="slides-subtitle">Manage your homepage carousel promotions</p>
          </div>
          <button class="btn-add" (click)="openForm()">
            <span>+</span> New Slide
          </button>
        </div>

        @if (loading()) {
          <app-spinner />
        } @else {
          <!-- Slides List -->
          <div class="slides-grid">
            @for (slide of slides(); track slide._id; let i = $index) {
              <div class="slide-card" [class.inactive]="!slide.active">
                <div class="slide-preview" [style.background]="slide.imageUrl ? 'url(' + slide.imageUrl + ') center/cover' : slide.bgGradient">
                  <div class="slide-preview-overlay">
                    @if (slide.badge) {
                      <span class="preview-badge">{{ slide.badge }}</span>
                    }
                    <h3 class="preview-title">{{ slide.title }}</h3>
                    <p class="preview-sub">{{ slide.subtitle }}</p>
                  </div>
                  <div class="slide-status" [class.active]="slide.active">
                    {{ slide.active ? 'Active' : 'Inactive' }}
                  </div>
                  <span class="slide-order">#{{ slide.order }}</span>
                </div>
                <div class="slide-actions">
                  <button class="sa-btn" (click)="editSlide(slide)" title="Edit">✏️</button>
                  <button class="sa-btn" (click)="toggleActive(slide)" [title]="slide.active ? 'Deactivate' : 'Activate'">
                    {{ slide.active ? '🔴' : '🟢' }}
                  </button>
                  <button class="sa-btn danger" (click)="deleteSlide(slide)" title="Delete">🗑️</button>
                </div>
              </div>
            } @empty {
              <div class="empty-slides">
                <span class="empty-icon">🖼️</span>
                <h3>No slides yet</h3>
                <p>Create your first carousel slide to showcase promotions and events.</p>
              </div>
            }
          </div>
        }

        <!-- Slide Form Modal -->
        @if (showForm()) {
          <div class="modal-backdrop" (click)="closeForm()">
            <div class="modal-content" (click)="$event.stopPropagation()">
              <div class="modal-header">
                <h2>{{ editingSlide ? 'Edit Slide' : 'New Slide' }}</h2>
                <button class="modal-close" (click)="closeForm()">✕</button>
              </div>

              @if (formError()) {
                <div class="form-error">{{ formError() }}</div>
              }

              <form (ngSubmit)="onSubmit()" class="slide-form">
                <!-- Image Upload -->
                <div class="form-group">
                  <label>Slide Image (optional)</label>
                  <div class="img-upload-row">
                    @if (imagePreview()) {
                      <div class="thumb-wrap">
                        <img [src]="imagePreview()!" alt="Preview" class="thumb-img" />
                        <button type="button" class="thumb-remove" (click)="removeImage()">✕</button>
                      </div>
                    } @else {
                      <label class="upload-btn" for="slideImage">📷 Upload Image</label>
                    }
                    <input type="file" id="slideImage" accept="image/*" (change)="onFileSelected($event)" hidden />
                    <span class="upload-hint">Recommended: 1920×1080 (16:9)</span>
                  </div>
                </div>

                <div class="form-group">
                  <label for="slideTitle">Title *</label>
                  <input id="slideTitle" type="text" [(ngModel)]="form.title" name="title" required placeholder="e.g. Summer Sale 50% Off" />
                </div>

                <div class="form-group">
                  <label for="slideSubtitle">Subtitle</label>
                  <input id="slideSubtitle" type="text" [(ngModel)]="form.subtitle" name="subtitle" placeholder="e.g. Limited time offer on all products" />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="slideBadge">Badge Text</label>
                    <input id="slideBadge" type="text" [(ngModel)]="form.badge" name="badge" placeholder="e.g. ✨ New Arrivals" />
                  </div>
                  <div class="form-group">
                    <label for="slideOrder">Order</label>
                    <input id="slideOrder" type="number" [(ngModel)]="form.order" name="order" min="0" />
                  </div>
                </div>

                <div class="form-group">
                  <label for="slideBg">Background Gradient (fallback)</label>
                  <select id="slideBg" [(ngModel)]="form.bgGradient" name="bgGradient" class="form-select">
                    <option value="linear-gradient(135deg, #1a1a3e 0%, #2d1b69 50%, #1a1a3e 100%)">Purple Dark</option>
                    <option value="linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)">Teal Ocean</option>
                    <option value="linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)">Deep Blue</option>
                    <option value="linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 50%, #2d1b4e 100%)">Midnight</option>
                    <option value="linear-gradient(135deg, #141E30 0%, #243B55 50%, #141E30 100%)">Steel</option>
                    <option value="linear-gradient(135deg, #1f1c2c 0%, #928DAB 50%, #1f1c2c 100%)">Lavender</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="checkbox-label">
                    <input type="checkbox" [(ngModel)]="form.active" name="active" />
                    <span>Active (visible on homepage)</span>
                  </label>
                </div>

                <div class="modal-actions">
                  <button type="button" class="btn-cancel" (click)="closeForm()">Cancel</button>
                  <button type="submit" class="btn-submit" [disabled]="saving()">
                    {{ saving() ? 'Saving...' : editingSlide ? 'Update Slide' : 'Create Slide' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        }
      </div>
    </div>
  `,
    styles: [`
    .slides-page {
      min-height: calc(100vh - 70px);
      padding: 40px 24px 60px;
    }

    .slides-container {
      max-width: 1100px;
      margin: 0 auto;
    }

    .slides-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .slides-title {
      font-size: 1.8rem;
      font-weight: 800;
      color: #fff;
      margin: 0;
    }

    .slides-subtitle {
      color: rgba(255, 255, 255, 0.4);
      margin: 4px 0 0;
      font-size: 0.95rem;
    }

    .btn-add {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #a78bfa, #60a5fa);
      color: #fff;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
    }

    .btn-add:hover {
      opacity: 0.9;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(167, 139, 250, 0.3);
    }

    .btn-add span { font-size: 1.2rem; font-weight: 300; }

    /* Slides Grid */
    .slides-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 20px;
    }

    .slide-card {
      background: rgba(30, 30, 50, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.2s;
    }

    .slide-card.inactive { opacity: 0.5; }
    .slide-card:hover { border-color: rgba(167, 139, 250, 0.3); }

    .slide-preview {
      position: relative;
      aspect-ratio: 16 / 9;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .slide-preview-overlay {
      position: relative;
      z-index: 1;
      text-align: center;
      padding: 20px;
    }

    .preview-badge {
      display: inline-block;
      padding: 4px 12px;
      background: rgba(167, 139, 250, 0.2);
      color: #a78bfa;
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    .preview-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #fff;
      margin: 0 0 4px;
    }

    .preview-sub {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
    }

    .slide-status {
      position: absolute;
      top: 8px;
      right: 8px;
      padding: 3px 10px;
      border-radius: 8px;
      font-size: 0.7rem;
      font-weight: 600;
      background: rgba(248, 113, 113, 0.2);
      color: #f87171;
      z-index: 2;
    }

    .slide-status.active {
      background: rgba(52, 211, 153, 0.2);
      color: #34d399;
    }

    .slide-order {
      position: absolute;
      top: 8px;
      left: 8px;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      background: rgba(0, 0, 0, 0.5);
      color: rgba(255, 255, 255, 0.7);
      z-index: 2;
    }

    .slide-actions {
      display: flex;
      gap: 8px;
      padding: 12px 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.04);
    }

    .sa-btn {
      flex: 1;
      padding: 8px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.06);
      background: rgba(15, 15, 25, 0.5);
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.85rem;
    }

    .sa-btn:hover {
      border-color: rgba(167, 139, 250, 0.4);
      background: rgba(167, 139, 250, 0.1);
    }

    .sa-btn.danger:hover {
      border-color: rgba(248, 113, 113, 0.5);
      background: rgba(248, 113, 113, 0.1);
    }

    .empty-slides {
      grid-column: 1 / -1;
      text-align: center;
      padding: 80px 24px;
      color: rgba(255, 255, 255, 0.5);
    }

    .empty-icon { font-size: 3rem; display: block; margin-bottom: 16px; }
    .empty-slides h3 { color: #fff; margin: 0 0 8px; }
    .empty-slides p { margin: 0; }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(4px);
      z-index: 1100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }

    .modal-content {
      background: #1a1a2e;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      width: 100%;
      max-width: 560px;
      max-height: 85vh;
      overflow-y: auto;
      padding: 32px;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.3rem;
      font-weight: 700;
      color: #fff;
    }

    .modal-close {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: none;
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .modal-close:hover { color: #fff; border-color: rgba(255, 255, 255, 0.3); }

    .form-error {
      background: rgba(248, 113, 113, 0.12);
      border: 1px solid rgba(248, 113, 113, 0.3);
      color: #f87171;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 0.85rem;
      margin-bottom: 20px;
    }

    .slide-form { display: flex; flex-direction: column; gap: 18px; }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 100px;
      gap: 16px;
    }

    .form-group label {
      display: block;
      font-size: 0.82rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 6px;
    }

    .form-group input[type="text"],
    .form-group input[type="number"],
    .form-select {
      width: 100%;
      padding: 10px 14px;
      background: rgba(15, 15, 25, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      color: #fff;
      font-size: 0.9rem;
      font-family: inherit;
      outline: none;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }

    .form-group input:focus, .form-select:focus {
      border-color: rgba(167, 139, 250, 0.5);
    }

    .form-group input::placeholder { color: rgba(255, 255, 255, 0.25); }

    .form-select {
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 32px;
    }

    .form-select option { background: #1e1e32; }

    .checkbox-label {
      display: flex !important;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: #a78bfa;
    }

    .checkbox-label span {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
    }

    /* Image upload */
    .img-upload-row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .upload-btn {
      padding: 8px 18px;
      border-radius: 8px;
      border: 1px dashed rgba(255, 255, 255, 0.15);
      background: rgba(15, 15, 25, 0.4);
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .upload-btn:hover {
      border-color: rgba(167, 139, 250, 0.4);
      color: #a78bfa;
    }

    .upload-hint {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.3);
    }

    .thumb-wrap {
      position: relative;
      width: 120px;
      height: 68px;
      border-radius: 8px;
      overflow: hidden;
    }

    .thumb-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .thumb-remove {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: none;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      cursor: pointer;
      font-size: 0.7rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 8px;
    }

    .btn-cancel {
      padding: 10px 20px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: none;
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
    }

    .btn-cancel:hover { border-color: rgba(255, 255, 255, 0.3); color: #fff; }

    .btn-submit {
      padding: 10px 28px;
      border: none;
      border-radius: 8px;
      background: linear-gradient(135deg, #a78bfa, #60a5fa);
      color: #fff;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
    }

    .btn-submit:hover:not(:disabled) { opacity: 0.9; }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

    @media (max-width: 768px) {
      .slides-grid { grid-template-columns: 1fr; }
      .modal-content { padding: 24px; }
      .form-row { grid-template-columns: 1fr; }
    }
  `],
})
export class SlideManagerComponent implements OnInit {
    slides = signal<Slide[]>([]);
    loading = signal(true);
    saving = signal(false);
    showForm = signal(false);
    formError = signal('');
    imagePreview = signal<string | null>(null);

    editingSlide: Slide | null = null;
    selectedFile: File | null = null;

    form = {
        title: '',
        subtitle: '',
        badge: '',
        imageUrl: '',
        imagePublicId: '',
        bgGradient: 'linear-gradient(135deg, #1a1a3e 0%, #2d1b69 50%, #1a1a3e 100%)',
        order: 0,
        active: true,
    };

    constructor(private api: ApiService) {}

    ngOnInit() {
        this.loadSlides();
    }

    loadSlides() {
        this.loading.set(true);
        this.api.getAllSlides().subscribe({
            next: (res) => {
                this.slides.set(res.data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false),
        });
    }

    openForm() {
        this.editingSlide = null;
        this.form = {
            title: '',
            subtitle: '',
            badge: '',
            imageUrl: '',
            imagePublicId: '',
            bgGradient: 'linear-gradient(135deg, #1a1a3e 0%, #2d1b69 50%, #1a1a3e 100%)',
            order: this.slides().length,
            active: true,
        };
        this.selectedFile = null;
        this.imagePreview.set(null);
        this.formError.set('');
        this.showForm.set(true);
    }

    editSlide(slide: Slide) {
        this.editingSlide = slide;
        this.form = {
            title: slide.title,
            subtitle: slide.subtitle,
            badge: slide.badge,
            imageUrl: slide.imageUrl,
            imagePublicId: slide.imagePublicId,
            bgGradient: slide.bgGradient,
            order: slide.order,
            active: slide.active,
        };
        this.selectedFile = null;
        this.imagePreview.set(slide.imageUrl || null);
        this.formError.set('');
        this.showForm.set(true);
    }

    closeForm() {
        this.showForm.set(false);
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            this.selectedFile = input.files[0];
            const reader = new FileReader();
            reader.onload = () => this.imagePreview.set(reader.result as string);
            reader.readAsDataURL(this.selectedFile);
        }
    }

    removeImage() {
        this.selectedFile = null;
        this.imagePreview.set(null);
        this.form.imageUrl = '';
        this.form.imagePublicId = '';
    }

    async onSubmit() {
        if (!this.form.title) {
            this.formError.set('Title is required');
            return;
        }

        this.saving.set(true);
        this.formError.set('');

        try {
            // Upload image if selected
            if (this.selectedFile) {
                const uploadRes = await this.api.uploadImage(this.selectedFile).toPromise();
                if (uploadRes?.success) {
                    this.form.imageUrl = uploadRes.data.url;
                    this.form.imagePublicId = uploadRes.data.publicId;
                }
            }

            const req$ = this.editingSlide
                ? this.api.updateSlide(this.editingSlide._id, this.form)
                : this.api.createSlide(this.form);

            req$.subscribe({
                next: () => {
                    this.saving.set(false);
                    this.showForm.set(false);
                    this.loadSlides();
                },
                error: (err) => {
                    this.saving.set(false);
                    this.formError.set(err.error?.message || 'Failed to save slide');
                },
            });
        } catch (err: any) {
            this.saving.set(false);
            this.formError.set(err.error?.message || 'Image upload failed');
        }
    }

    toggleActive(slide: Slide) {
        this.api.updateSlide(slide._id, { active: !slide.active }).subscribe({
            next: () => this.loadSlides(),
            error: (err) => alert(err.error?.message || 'Failed to update slide'),
        });
    }

    deleteSlide(slide: Slide) {
        if (!confirm(`Delete slide "${slide.title}"? This cannot be undone.`)) return;

        this.api.deleteSlide(slide._id).subscribe({
            next: () => this.loadSlides(),
            error: (err) => alert(err.error?.message || 'Failed to delete slide'),
        });
    }
}
