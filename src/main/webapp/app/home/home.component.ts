import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { IPost } from '../entities/post/post.model';
import { PostService } from '../entities/post/service/post.service';
import { ParseLinks } from '../core/util/parse-links.service';
import { ASC, DESC, ITEMS_PER_PAGE } from '../config/pagination.constants';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  posts: IPost[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private router: Router,
    protected postService: PostService,
    protected parseLinks: ParseLinks
  ) {
    this.posts = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAllPublished(): void {
    this.isLoading = true;

    this.postService
      .queryPublicated({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<IPost[]>) => {
          this.isLoading = false;
          this.paginatePosts(res.body, res.headers);
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  ngOnInit(): void {
    this.loadAllPublished();
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAllPublished();
  }

  reset(): void {
    this.page = 0;
    this.posts = [];
    this.loadAllPublished();
  }

  trackId(index: number, item: IPost): number {
    return item.id!;
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? ASC : DESC)];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginatePosts(data: IPost[] | null, headers: HttpHeaders): void {
    const linkHeader = headers.get('link');
    if (linkHeader) {
      this.links = this.parseLinks.parse(linkHeader);
    } else {
      this.links = {
        last: 0,
      };
    }
    if (data) {
      for (const d of data) {
        this.posts.push(d);
      }
    }
  }
}
